import React from 'react';
import { Line } from 'react-konva';

interface GridProps {
  width: number;
  height: number;
  scale: number;
}

const Grid: React.FC<GridProps> = ({ width, height, scale }) => {
  const gridSize = 20;
  const lines = [];
  
  // Only show grid when zoomed in enough
  if (scale > 0.5) {
    const opacity = Math.min(0.3, scale * 0.3);
    
    // Vertical lines
    for (let i = 0; i < width / scale; i += gridSize) {
      lines.push(
        <Line
          key={`v${i}`}
          points={[i, 0, i, height / scale]}
          stroke="#E5E7EB"
          strokeWidth={1}
          opacity={opacity}
        />
      );
    }
    
    // Horizontal lines
    for (let i = 0; i < height / scale; i += gridSize) {
      lines.push(
        <Line
          key={`h${i}`}
          points={[0, i, width / scale, i]}
          stroke="#E5E7EB"
          strokeWidth={1}
          opacity={opacity}
        />
      );
    }
  }
  
  return <>{lines}</>;
};

export default Grid;