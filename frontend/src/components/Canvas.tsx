import React, { useRef, useState, useEffect } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { useStore, Widget } from '../store';

export const Canvas = () => {
  const { widgets, dataTree, addWidget, updateWidget, selectedWidgetId, setSelectedWidgetId } = useStore();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    if (wrapperRef.current) {
      setWidth(wrapperRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (wrapperRef.current) setWidth(wrapperRef.current.offsetWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const widgetStr = e.dataTransfer.getData('widget');
    if (!widgetStr) return;
    const widgetTypeData = JSON.parse(widgetStr);
    
    // Calculate approximate drop position based on mouse coordinates relative to wrapper
    const rect = wrapperRef.current?.getBoundingClientRect();
    const y = rect ? e.clientY - rect.top : 0;
    
    const newWidget: Widget = {
      id: `${widgetTypeData.type}_${Date.now()}`,
      type: widgetTypeData.type,
      x: 0,
      y: Math.floor(y / 30),
      w: widgetTypeData.defaultW,
      h: widgetTypeData.defaultH,
      props: widgetTypeData.props,
    };
    addWidget(newWidget);
  };

  const onLayoutChange = (layout: Layout[]) => {
    layout.forEach((l) => {
      updateWidget(l.i, { x: l.x, y: l.y, w: l.w, h: l.h });
    });
  };

  const renderWidgetContent = (w: Widget) => {
    const evaluatedProps = dataTree[w.id] || w.props;
    
    switch (w.type) {
      case 'BUTTON':
        return <button className="w-full h-full bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium text-sm transition-colors">{evaluatedProps.text || 'Button'}</button>;
      case 'TEXT':
        return <div className="w-full h-full flex items-center text-gray-200 text-sm overflow-hidden">{evaluatedProps.text || 'Text'}</div>;
      case 'INPUT':
        return <input type="text" placeholder={evaluatedProps.placeholder} className="w-full h-full bg-gray-800 border border-gray-600 rounded px-3 text-white text-sm outline-none focus:border-indigo-500" />;
      case 'TABLE':
        let data = evaluatedProps.data;
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (e) { data = []; }
        }
        if (!Array.isArray(data)) data = [];
        return (
          <div className="w-full h-full bg-gray-800 border border-gray-600 rounded overflow-auto custom-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-700 text-xs text-gray-300 uppercase sticky top-0">
                <tr>
                  {data.length > 0 && Object.keys(data[0]).map(k => <th key={k} className="px-3 py-2">{k}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-gray-700 hover:bg-gray-700/50">
                    {Object.values(row).map((val: any, j: number) => <td key={j} className="px-3 py-2 text-gray-300">{String(val)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length === 0 && <div className="p-4 text-center text-gray-500 text-xs">No data</div>}
          </div>
        );
      default:
        return <div className="text-gray-500 text-xs p-2">Unknown Widget</div>;
    }
  };

  return (
    <div 
      ref={wrapperRef}
      className="flex-1 bg-gray-900 relative overflow-y-auto"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      style={{ backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      onClick={(e) => {
         if (e.target === wrapperRef.current) setSelectedWidgetId(null);
      }}
    >
      <GridLayout
        className="layout min-h-full"
        layout={widgets.map(w => ({ i: w.id, x: w.x, y: w.y, w: w.w, h: w.h }))}
        cols={12}
        rowHeight={30}
        width={width}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
        isDroppable={true}
      >
        {widgets.map(w => (
          <div 
            key={w.id} 
            className={`group relative ${selectedWidgetId === w.id ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-900 z-10' : 'ring-1 ring-transparent hover:ring-gray-600'} transition-all`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedWidgetId(w.id);
            }}
          >
            <div className="drag-handle absolute -top-5 left-0 px-2 py-0.5 bg-indigo-600 rounded-t cursor-move hidden group-hover:block text-[10px] text-white font-mono shadow-md whitespace-nowrap">
              {w.id}
            </div>
            {renderWidgetContent(w)}
          </div>
        ))}
      </GridLayout>
    </div>
  );
};
