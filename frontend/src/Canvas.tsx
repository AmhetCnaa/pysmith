import React from 'react';
import GridLayout, { Layout, WidthProvider } from 'react-grid-layout';
import { useStore, Widget } from './store';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { GripHorizontal } from 'lucide-react';

const ResponsiveGridLayout = WidthProvider(GridLayout);

const WidgetRenderer = ({ widget }: { widget: Widget }) => {
  const dataTree = useStore(state => state.dataTree);
  const props = dataTree[`${widget.id}_EVAL`] || widget.props;

  switch (widget.type) {
    case 'BUTTON':
      return <button className="w-full h-full bg-blue-600 text-white font-medium rounded shadow hover:bg-blue-700 transition-colors">{props.text || 'Button'}</button>;
    case 'TEXT':
      return <div className="w-full h-full flex items-center text-gray-100">{props.text || 'Text'}</div>;
    case 'INPUT':
      return <input type="text" placeholder={props.placeholder || 'Enter text'} className="w-full h-full p-2 bg-gray-800 text-gray-100 border border-gray-600 rounded focus:border-blue-500 outline-none" />;
    case 'TABLE':
      const data = Array.isArray(props.data) ? props.data : [];
      return (
        <div className="w-full h-full bg-gray-800 rounded border border-gray-600 overflow-auto">
           {data.length > 0 ? (
             <table className="w-full text-left border-collapse text-sm text-gray-200">
               <thead>
                 <tr>
                   {Object.keys(data[0]).map(key => <th key={key} className="p-2 border-b border-gray-700 bg-gray-900">{key}</th>)}
                 </tr>
               </thead>
               <tbody>
                 {data.map((row, i) => (
                   <tr key={i} className="hover:bg-gray-700">
                     {Object.values(row).map((val: any, j) => <td key={j} className="p-2 border-b border-gray-700">{String(val)}</td>)}
                   </tr>
                 ))}
               </tbody>
             </table>
           ) : <div className="p-4 text-gray-400 text-center">No data provided or evaluating...</div>}
        </div>
      );
    default:
      return null;
  }
};

export const Canvas: React.FC = () => {
  const { widgets, updateWidgetLayout, setSelectedWidget, selectedWidgetId } = useStore();

  const onLayoutChange = (layout: Layout[]) => {
    layout.forEach(l => {
      updateWidgetLayout(l.i, { x: l.x, y: l.y, w: l.w, h: l.h });
    });
  };

  return (
    <div 
      className="flex-1 bg-gray-900 relative overflow-auto border-x border-gray-700 h-full" 
      style={{ backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      onClick={() => setSelectedWidget(null)}
    >
      <ResponsiveGridLayout
        className="layout min-h-full"
        layout={widgets.map(w => ({ i: w.id, x: w.x, y: w.y, w: w.w, h: w.h }))}
        cols={12}
        rowHeight={30}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
        margin={[10, 10]}
      >
        {widgets.map(widget => (
          <div 
            key={widget.id} 
            className={`group rounded ${selectedWidgetId === widget.id ? 'ring-2 ring-blue-500' : 'ring-1 ring-transparent hover:ring-gray-600'}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedWidget(widget.id);
            }}
          >
            <div className="drag-handle absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-700 text-gray-200 rounded px-2 cursor-move opacity-0 group-hover:opacity-100 z-20 shadow">
               <GripHorizontal size={14} />
            </div>
            <div className="w-full h-full z-0">
              <WidgetRenderer widget={widget} />
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};
