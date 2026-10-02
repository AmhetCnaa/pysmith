import React from 'react';
import { useStore } from './store';
import { Type, Square, LayoutGrid, FormInput } from 'lucide-react';

const WIDGETS = [
  { type: 'TEXT', icon: Type, label: 'Text' },
  { type: 'BUTTON', icon: Square, label: 'Button' },
  { type: 'INPUT', icon: FormInput, label: 'Input' },
  { type: 'TABLE', icon: LayoutGrid, label: 'Table' },
] as const;

export const LeftSidebar: React.FC = () => {
  const { addWidget } = useStore();

  const handleAdd = (type: string) => {
    addWidget({
      type: type as any,
      x: 0,
      y: 0,
      w: type === 'TABLE' ? 6 : 3,
      h: type === 'TABLE' ? 6 : 1,
      props: {}
    });
  };

  return (
    <div className="w-64 bg-gray-900 h-full p-4 border-r border-gray-700 flex flex-col">
      <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2">
        <Square className="text-blue-500" />
        LowCode MVP
      </h2>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Widgets</div>
      <div className="grid grid-cols-2 gap-2">
        {WIDGETS.map(({ type, icon: Icon, label }) => (
          <div
            key={type}
            onClick={() => handleAdd(type)}
            className="flex flex-col items-center justify-center p-3 bg-gray-800 hover:bg-gray-700 rounded cursor-pointer border border-gray-700 hover:border-gray-500 transition-colors"
          >
            <Icon size={24} className="text-gray-300 mb-2" />
            <span className="text-xs text-gray-300 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
