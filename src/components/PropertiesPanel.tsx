import React from 'react';
import { Trash2, Copy, RotateCw } from 'lucide-react';
import { useCircuit } from '../context/CircuitContext';

const PropertiesPanel: React.FC = () => {
  const { selectedComponent, updateComponent, deleteComponent, duplicateComponent, simulationState } = useCircuit();

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Properties</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Select a component to view and edit its properties.
        </p>
      </div>
    );
  }

  const handlePropertyChange = (key: string, value: any) => {
    updateComponent(selectedComponent.id, {
      ...selectedComponent.properties,
      [key]: value
    });
  };

  const getComponentFields = () => {
    switch (selectedComponent.type) {
      case 'resistor':
        return [
          { key: 'name', label: 'Name', type: 'text', value: selectedComponent.properties.name || 'R1' },
          { key: 'value', label: 'Resistance', type: 'text', value: selectedComponent.properties.value || '1k', unit: 'Ω' },
          { key: 'tolerance', label: 'Tolerance', type: 'select', value: selectedComponent.properties.tolerance || '5%', options: ['1%', '5%', '10%', '20%'] },
          { key: 'power', label: 'Power Rating', type: 'text', value: selectedComponent.properties.power || '0.25', unit: 'W' },
        ];
      
      case 'capacitor':
        return [
          { key: 'name', label: 'Name', type: 'text', value: selectedComponent.properties.name || 'C1' },
          { key: 'value', label: 'Capacitance', type: 'text', value: selectedComponent.properties.value || '10µ', unit: 'F' },
          { key: 'voltage', label: 'Voltage Rating', type: 'text', value: selectedComponent.properties.voltage || '50', unit: 'V' },
          { key: 'type', label: 'Type', type: 'select', value: selectedComponent.properties.capacitorType || 'Ceramic', options: ['Ceramic', 'Electrolytic', 'Tantalum', 'Film'] },
        ];
      
      case 'dc_source':
        return [
          { key: 'name', label: 'Name', type: 'text', value: selectedComponent.properties.name || 'V1' },
          { key: 'value', label: 'Voltage', type: 'number', value: selectedComponent.properties.value || '12', unit: 'V' },
          { key: 'current', label: 'Max Current', type: 'text', value: selectedComponent.properties.current || '1', unit: 'A' },
        ];
      
      case 'switch':
        return [
          { key: 'name', label: 'Name', type: 'text', value: selectedComponent.properties.name || 'S1' },
          { key: 'isClosed', label: 'State', type: 'checkbox', value: selectedComponent.properties.isClosed || false, label2: 'Closed' },
          { key: 'type', label: 'Type', type: 'select', value: selectedComponent.properties.switchType || 'SPST', options: ['SPST', 'SPDT', 'DPST', 'DPDT'] },
        ];
      
      default:
        return [
          { key: 'name', label: 'Name', type: 'text', value: selectedComponent.properties.name || 'COMP1' },
        ];
    }
  };

  const fields = getComponentFields();

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Properties</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => duplicateComponent(selectedComponent.id)}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-150"
              title="Duplicate"
            >
              <Copy size={16} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-150" title="Rotate">
              <RotateCw size={16} />
            </button>
            <button
              onClick={() => deleteComponent(selectedComponent.id)}
              className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-150"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {selectedComponent.type.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.label}
            </label>
            
            {field.type === 'text' || field.type === 'number' ? (
              <div className="relative">
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => handlePropertyChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {field.unit && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {field.unit}
                  </span>
                )}
              </div>
            ) : field.type === 'select' ? (
              <select
                value={field.value}
                onChange={(e) => handlePropertyChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => handlePropertyChange(field.key, e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{field.label2}</span>
              </label>
            ) : null}
          </div>
        ))}

        {/* Simulation Data */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Simulation Data</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Voltage:</span>
              <span className="text-sm font-mono text-gray-900 dark:text-white">
                {selectedComponent.id in (simulationState?.componentStates || {}) 
                  ? `${(simulationState.componentStates[selectedComponent.id]?.voltage || 0).toFixed(2)}V`
                  : '0.00V'
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Current:</span>
              <span className="text-sm font-mono text-gray-900 dark:text-white">
                {selectedComponent.id in (simulationState?.componentStates || {}) 
                  ? `${(simulationState.componentStates[selectedComponent.id]?.current || 0).toFixed(3)}A`
                  : '0.000A'
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Power:</span>
              <span className="text-sm font-mono text-gray-900 dark:text-white">
                {(() => {
                  const state = simulationState?.componentStates?.[selectedComponent.id];
                  const power = state ? (state.voltage || 0) * (state.current || 0) : 0;
                  return `${power.toFixed(3)}W`;
                })()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;