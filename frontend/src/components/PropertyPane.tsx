import React from 'react';
import { useStore } from '../store';

export const PropertyPane = () => {
  const { widgets, selectedWidgetId, updateWidgetProp, dataTree } = useStore();

  const selectedWidget = widgets.find(w => w.id === selectedWidgetId);

  if (!selectedWidget) {
    return (
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 flex flex-col text-gray-400 justify-center items-center">
        <p className="text-center text-sm">Select a widget to edit its properties.</p>
      </div>
    );
  }

  const evaluatedProps = dataTree[selectedWidget.id] || {};

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
        <h2 className="text-lg font-semibold text-gray-200">{selectedWidget.type}</h2>
        <div className="text-xs text-indigo-400 font-mono mt-1">{selectedWidget.id}</div>
      </div>
      
      <div className="p-4 flex flex-col gap-5">
        {Object.entries(selectedWidget.props).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">{key}</label>
            <textarea 
              className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-y min-h-[60px] custom-scrollbar transition-colors"
              value={typeof value === 'string' ? value : JSON.stringify(value)}
              onChange={(e) => updateWidgetProp(selectedWidget.id, key, e.target.value)}
            />
            <div className="text-[10px] text-gray-500 flex justify-between">
              <span>Supports {'{{ JS }}'}</span>
            </div>
            
            {/* Live Evaluation Preview */}
            {typeof value === 'string' && value.includes('{{') && (
              <div className="mt-1 p-2 bg-gray-900/50 rounded border border-gray-700 text-xs">
                <span className="text-gray-500 mr-2">Evaluates to:</span>
                <span className="text-green-400 font-mono truncate block mt-1">
                  {JSON.stringify(evaluatedProps[key]) ?? 'undefined'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
