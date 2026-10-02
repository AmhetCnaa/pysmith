import React from 'react';
import { Type, Square, LayoutGrid, FormInput } from 'lucide-react';
import { useStore } from '../store';

const WIDGETS = [
  { type: 'BUTTON', label: 'Button', icon: Square, defaultW: 2, defaultH: 1, props: { text: 'Button' } },
  { type: 'TEXT', label: 'Text', icon: Type, defaultW: 3, defaultH: 1, props: { text: 'Hello {{Api1.data.name}}' } },
  { type: 'INPUT', label: 'Input', icon: FormInput, defaultW: 3, defaultH: 1, props: { placeholder: 'Enter text...' } },
  { type: 'TABLE', label: 'Table', icon: LayoutGrid, defaultW: 6, defaultH: 4, props: { data: '{{ [{id: 1, name: "Test"}] }}' } },
];

export const LeftSidebar = () => {
  const onDragStart = (e: React.DragEvent, widget: any) => {
    e.dataTransfer.setData('widget', JSON.stringify(widget));
  };

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-200 mb-2">Widgets</h2>
      <div className="text-xs text-gray-400 mb-2">Drag widgets onto the canvas</div>
      {WIDGETS.map((w) => (
        <div
          key={w.type}
          draggable
          onDragStart={(e) => onDragStart(e, w)}
          className="flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded cursor-grab active:cursor-grabbing transition-colors"
        >
          <w.icon size={18} className="text-indigo-400" />
          <span className="text-sm font-medium">{w.label}</span>
        </div>
      ))}
    </div>
  );
};
