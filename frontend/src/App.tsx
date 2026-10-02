import React from 'react';
import { LeftSidebar } from './components/LeftSidebar';
import { Canvas } from './components/Canvas';
import { PropertyPane } from './components/PropertyPane';

function App() {
  return (
    <div className="flex h-screen w-screen bg-gray-900 text-gray-100 overflow-hidden font-sans">
      <LeftSidebar />
      <Canvas />
      <PropertyPane />
    </div>
  );
}

export default App;
