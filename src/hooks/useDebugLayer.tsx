import React from "react";
import { Layer, Circle } from "react-konva";
import { UMLDiagram } from "../types/umlTypes";

interface DebugLayerProps {
  diagram: UMLDiagram;
  enabled?: boolean;
}

export const DebugLayer: React.FC<DebugLayerProps> = ({ diagram, enabled = false }) => {
  if (!enabled) return null;

  return (
    <Layer>
      {/* Root (0,0) */}
      <Circle x={0} y={0} radius={4} stroke="blue" />
      {/* Element positions */}
      {diagram.elements.map((el) => (
        <Circle key={el.id} x={el.x} y={el.y} radius={4} stroke="blue" />
      ))}
    </Layer>
  );
};
