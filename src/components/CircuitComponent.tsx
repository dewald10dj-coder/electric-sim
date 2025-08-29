import React from 'react';
import { Group, Rect, Line, Circle, Text } from 'react-konva';
import { Component, SimulationState } from '../types/circuit';

interface CircuitComponentProps {
  component: Component;
  isSelected: boolean;
  onSelect: () => void;
  onDrag: (x: number, y: number) => void;
  simulationState: SimulationState;
}

const CircuitComponent: React.FC<CircuitComponentProps> = ({
  component,
  isSelected,
  onSelect,
  onDrag,
  simulationState
}) => {
  const { x, y, type, properties, id } = component;
  const isActive = simulationState.componentStates[id]?.isActive || false;
  const voltage = simulationState.componentStates[id]?.voltage || 0;
  const current = simulationState.componentStates[id]?.current || 0;

  const renderComponentSymbol = () => {
    const strokeColor = isActive ? '#10B981' : '#374151';
    const strokeWidth = isActive ? 2 : 1.5;

    switch (type) {
      case 'resistor':
        return (
          <Group>
            <Line points={[0, 0, 20, 0]} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line points={[40, 0, 60, 0]} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Rect
              x={20}
              y={-8}
              width={20}
              height={16}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              cornerRadius={2}
            />
            <Text
              x={30}
              y={-25}
              text={`${properties.name || 'R1'}`}
              fontSize={10}
              fill="#374151"
              align="center"
              offsetX={15}
            />
            <Text
              x={30}
              y={12}
              text={`${properties.value || '1k'}Ω`}
              fontSize={8}
              fill="#6B7280"
              align="center"
              offsetX={12}
            />
          </Group>
        );

      case 'capacitor':
        return (
          <Group>
            <Line points={[0, 0, 22, 0]} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line points={[38, 0, 60, 0]} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line points={[22, -12, 22, 12]} stroke={strokeColor} strokeWidth={strokeWidth * 1.5} />
            <Line points={[38, -12, 38, 12]} stroke={strokeColor} strokeWidth={strokeWidth * 1.5} />
            <Text
              x={30}
              y={-25}
              text={`${properties.name || 'C1'}`}
              fontSize={10}
              fill="#374151"
              align="center"
              offsetX={15}
            />
            <Text
              x={30}
              y={18}
              text={`${properties.value || '10µ'}F`}
              fontSize={8}
              fill="#6B7280"
              align="center"
              offsetX={12}
            />
          </Group>
        );

      case 'dc_source':
        return (
          <Group>
            <Circle x={30} y={0} radius={25} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line points={[25, 0, 35, 0]} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line points={[30, -5, 30, 5]} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line points={[5, 0, 30, 0]} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line points={[30, 0, 55, 0]} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Text
              x={30}
              y={-40}
              text={`${properties.name || 'V1'}`}
              fontSize={10}
              fill="#374151"
              align="center"
              offsetX={15}
            />
            <Text
              x={30}
              y={35}
              text={`${properties.value || '12'}V`}
              fontSize={8}
              fill="#6B7280"
              align="center"
              offsetX={12}
            />
          </Group>
        );

      case 'switch':
        return (
          <Group>
            <Line points={[0, 0, 15, 0]} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line points={[45, 0, 60, 0]} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle x={15} y={0} radius={2} fill={strokeColor} />
            <Circle x={45} y={0} radius={2} fill={strokeColor} />
            <Line 
              points={properties.isClosed ? [15, 0, 45, 0] : [15, 0, 40, -10]} 
              stroke={strokeColor} 
              strokeWidth={strokeWidth}
            />
            <Text
              x={30}
              y={-25}
              text={`${properties.name || 'S1'}`}
              fontSize={10}
              fill="#374151"
              align="center"
              offsetX={15}
            />
          </Group>
        );

      default:
        return (
          <Group>
            <Rect
              width={60}
              height={30}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              cornerRadius={4}
            />
            <Text
              x={30}
              y={15}
              text={type}
              fontSize={8}
              fill="#374151"
              align="center"
              offsetX={15}
              offsetY={4}
            />
          </Group>
        );
    }
  };

  return (
    <Group
      x={x}
      y={y}
      draggable
      onClick={onSelect}
      onDragEnd={(e) => {
        const newX = Math.round(e.target.x() / 20) * 20;
        const newY = Math.round(e.target.y() / 20) * 20;
        onDrag(newX, newY);
      }}
    >
      {isSelected && (
        <Rect
          x={-10}
          y={-20}
          width={80}
          height={40}
          stroke="#3B82F6"
          strokeWidth={2}
          dash={[5, 5]}
          cornerRadius={4}
        />
      )}
      
      {renderComponentSymbol()}
      
      {simulationState.isRunning && (voltage !== 0 || current !== 0) && (
        <Group>
          <Text
            x={70}
            y={-10}
            text={`${voltage.toFixed(1)}V`}
            fontSize={8}
            fill="#10B981"
            fontStyle="bold"
          />
          <Text
            x={70}
            y={2}
            text={`${current.toFixed(2)}A`}
            fontSize={8}
            fill="#F59E0B"
            fontStyle="bold"
          />
        </Group>
      )}
    </Group>
  );
};

export default CircuitComponent;