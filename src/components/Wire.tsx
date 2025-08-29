import React from 'react';
import { Line, Circle } from 'react-konva';
import { Wire as WireType } from '../types/circuit';

interface WireProps {
  wire: WireType;
  isActive?: boolean;
}

const Wire: React.FC<WireProps> = ({ wire, isActive = false }) => {
  const { startX, startY, endX, endY, current } = wire;
  
  const strokeColor = isActive && current > 0 ? '#10B981' : '#6B7280';
  const strokeWidth = isActive && current > 0 ? 3 : 2;
  
  // Calculate intermediate points for right-angle routing
  const midX = startX + (endX - startX) / 2;
  const points = [startX, startY, midX, startY, midX, endY, endX, endY];

  return (
    <>
      <Line
        points={points}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        lineCap="round"
        lineJoin="round"
      />
      
      {/* Connection points */}
      <Circle
        x={startX}
        y={startY}
        radius={3}
        fill={strokeColor}
      />
      <Circle
        x={endX}
        y={endY}
        radius={3}
        fill={strokeColor}
      />
      
      {/* Current flow indicator */}
      {isActive && current > 0 && (
        <Circle
          x={midX}
          y={startY + (endY - startY) / 2}
          radius={4}
          fill="#10B981"
          opacity={0.8}
        />
      )}
    </>
  );
};

export default Wire;