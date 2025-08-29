import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import ComponentIcon from './ComponentIcon';
import { ComponentType } from '../types/circuit';

const ComponentPalette: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['basic']);

  const componentCategories = {
    basic: {
      name: 'Basic Components',
      components: [
        { type: 'resistor' as ComponentType, name: 'Resistor', symbol: 'R' },
        { type: 'capacitor' as ComponentType, name: 'Capacitor', symbol: 'C' },
        { type: 'inductor' as ComponentType, name: 'Inductor', symbol: 'L' },
        { type: 'diode' as ComponentType, name: 'Diode', symbol: 'D' },
      ]
    },
    sources: {
      name: 'Power Sources',
      components: [
        { type: 'dc_source' as ComponentType, name: 'DC Source', symbol: 'V' },
        { type: 'ac_source' as ComponentType, name: 'AC Source', symbol: 'V~' },
        { type: 'battery' as ComponentType, name: 'Battery', symbol: 'BAT' },
      ]
    },
    switches: {
      name: 'Control Devices',
      components: [
        { type: 'switch' as ComponentType, name: 'Switch', symbol: 'S' },
        { type: 'relay' as ComponentType, name: 'Relay', symbol: 'K' },
        { type: 'contactor' as ComponentType, name: 'Contactor', symbol: 'KM' },
        { type: 'circuit_breaker' as ComponentType, name: 'Circuit Breaker', symbol: 'Q' },
      ]
    },
    instruments: {
      name: 'Instruments',
      components: [
        { type: 'voltmeter' as ComponentType, name: 'Voltmeter', symbol: 'V' },
        { type: 'ammeter' as ComponentType, name: 'Ammeter', symbol: 'A' },
        { type: 'wattmeter' as ComponentType, name: 'Wattmeter', symbol: 'W' },
      ]
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleDragStart = (e: React.DragEvent, componentType: ComponentType) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ componentType }));
  };

  const filteredCategories = Object.entries(componentCategories).reduce((acc, [key, category]) => {
    const filteredComponents = category.components.filter(component =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredComponents.length > 0) {
      acc[key] = { ...category, components: filteredComponents };
    }
    return acc;
  }, {} as typeof componentCategories);

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Components</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(filteredCategories).map(([categoryKey, category]) => (
          <div key={categoryKey} className="mb-4">
            <button
              onClick={() => toggleCategory(categoryKey)}
              className="w-full flex items-center justify-between text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
            >
              <span>{category.name}</span>
              {expandedCategories.includes(categoryKey) ? 
                <ChevronDown size={16} /> : 
                <ChevronRight size={16} />
              }
            </button>
            
            {expandedCategories.includes(categoryKey) && (
              <div className="mt-2 space-y-2">
                {category.components.map((component) => (
                  <div
                    key={component.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component.type)}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-grab active:cursor-grabbing transition-colors duration-150"
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <ComponentIcon type={component.type} size={24} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {component.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {component.symbol}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentPalette;