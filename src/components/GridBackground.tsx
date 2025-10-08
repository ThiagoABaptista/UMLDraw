import React from "react";
import { Line } from "react-konva";

interface GridBackgroundProps {
  width: number;
  height: number;
  gridSize?: number;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  width,
  height,
  gridSize = 25,
}) => {
  const lines = [];

  for (let i = 0; i < width / gridSize; i++) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i * gridSize, 0, i * gridSize, height]}
        stroke="#e5e7eb"
        strokeWidth={0.5}
      />
    );
  }

  for (let j = 0; j < height / gridSize; j++) {
    lines.push(
      <Line
        key={`h-${j}`}
        points={[0, j * gridSize, width, j * gridSize]}
        stroke="#e5e7eb"
        strokeWidth={0.5}
      />
    );
  }

  return <>{lines}</>;
};
