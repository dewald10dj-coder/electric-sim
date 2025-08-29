import React, { useState } from 'react';
import Header from './components/Header';
import ComponentPalette from './components/ComponentPalette';
import CircuitCanvas from './components/CircuitCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import { CircuitProvider } from './context/CircuitContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <CircuitProvider>
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          <Header />
          <div className="flex-1 flex overflow-hidden">
            <ComponentPalette />
            <CircuitCanvas />
            <PropertiesPanel />
          </div>
        </div>
      </CircuitProvider>
    </ThemeProvider>
  );
}

export default App;