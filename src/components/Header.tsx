import React from 'react';
import { Play, Pause, Square, RotateCcw, Save, FolderOpen, Settings, Moon, Sun } from 'lucide-react';
import { useCircuit } from '../context/CircuitContext';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { simulationState, toggleSimulation, resetSimulation, stepSimulation } = useCircuit();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Circuit Simulator Pro</h1>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSimulation}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              {simulationState.isRunning ? <Pause size={16} /> : <Play size={16} />}
              <span>{simulationState.isRunning ? 'Pause' : 'Start'}</span>
            </button>
            
            <button
              onClick={stepSimulation}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Square size={16} />
              <span>Step</span>
            </button>
            
            <button
              onClick={resetSimulation}
              className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200">
              <Save size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200">
              <FolderOpen size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200">
              <Settings size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Status: {simulationState.isRunning ? 'Running' : 'Stopped'}</span>
            <span>Time: {simulationState.time.toFixed(2)}s</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;