import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import { useCircuit } from '../context/CircuitContext';
import CircuitComponent from './CircuitComponent';
import Wire from './Wire';
import Grid from './Grid';
import { ComponentType } from '../types/circuit';

const CircuitCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const { 
    components, 
    wires, 
    addComponent, 
    selectedComponent, 
    selectComponent,
    dragComponent,
    simulationState
  } = useCircuit();

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!stageRef.current) return;
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const stage = stageRef.current;
      const rect = stage.container().getBoundingClientRect();
      
      const x = (e.clientX - rect.left - position.x) / scale;
      const y = (e.clientY - rect.top - position.y) / scale;
      
      // Snap to grid (20px grid)
      const snappedX = Math.round(x / 20) * 20;
      const snappedY = Math.round(y / 20) * 20;
      
      addComponent(data.componentType as ComponentType, snappedX, snappedY);
    } catch (error) {
      console.error('Failed to parse drop data:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;
    
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = Math.max(0.25, Math.min(4, oldScale + direction * 0.1));
    
    setScale(newScale);
    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Deselect component if clicking on empty area
    if (e.target === e.target.getStage()) {
      selectComponent(null);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        draggable
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onDragEnd={(e) => {
          setPosition({ x: e.target.x(), y: e.target.y() });
        }}
      >
        <Layer>
          <Grid width={dimensions.width} height={dimensions.height} scale={scale} />
          
          {wires.map((wire) => (
            <Wire
              key={wire.id}
              wire={wire}
              isActive={simulationState.isRunning}
            />
          ))}
          
          {components.map((component) => (
            <CircuitComponent
              key={component.id}
              component={component}
              isSelected={selectedComponent?.id === component.id}
              onSelect={() => selectComponent(component)}
              onDrag={(x, y) => dragComponent(component.id, x, y)}
              simulationState={simulationState}
            />
          ))}
        </Layer>
      </Stage>
      
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Zoom: {Math.round(scale * 100)}%
        </span>
      </div>
    </div>
  );
};

export default CircuitCanvas;