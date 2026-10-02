import React from 'react';
import { useStore } from './store';

export const PropertyPane: React.FC = () => {
  const { widgets, selectedWidgetId, updateWidgetProp } = useStore();

  const selectedWidget = widgets.find(w => w.id === selectedWidgetId);

  if (!selectedWidget) {
    return (
      <div className="w-80 bg-gray-900 h-full p-4 text-gray-400 flex justify-center items-center text-sm">
        Select a widget to edit properties
      </div>
    );
  }

  const renderField = (key: string, label: string) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <input
        type="text"
        value={selectedWidget.props[key] || ''}
        onChange={(e) => updateWidgetProp(selectedWidget.id, key, e.target.value)}
        className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-600 rounded font-mono text-sm focus:border-blue-500 outline-none"
      />
    </div>
  );

  return (
    <div className="w-80 bg-gray-900 h-full p-4 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">{selectedWidget.type} Properties</h3>
      <div className="flex-1 overflow-auto">
        <div className="mb-4 text-xs text-gray-500 font-mono bg-gray-800 p-2 rounded break-all">ID: {selectedWidget.id}</div>
        
        {selectedWidget.type === 'BUTTON' && (
          <>
            {renderField('text', 'Label (Supports {{ }})')}
          </>
        )}
        
        {selectedWidget.type === 'TEXT' && (
          <>
            {renderField('text', 'Value (Supports {{ }})')}
          </>
        )}

        {selectedWidget.type === 'INPUT' && (
          <>
            {renderField('placeholder', 'Placeholder (Supports {{ }})')}
          </>
        )}

        {selectedWidget.type === 'TABLE' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Table Data (Supports {{ }})</label>
              <textarea
                value={selectedWidget.props.data || ''}
                onChange={(e) => updateWidgetProp(selectedWidget.id, 'data', e.target.value)}
                className="w-full h-32 p-2 bg-gray-800 text-gray-100 border border-gray-600 rounded font-mono text-sm focus:border-blue-500 outline-none"
                placeholder="{{ Api1.data }}"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
