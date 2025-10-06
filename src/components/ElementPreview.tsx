import React from "react";
import { Group } from "react-konva";
import { Tool } from "../types/umlTypes";
import { GaphorIcon } from "./GaphorIcon";

interface ElementPreviewProps {
  tool: Tool;
  x?: number;
  y?: number;
  size?: number;
  visible?: boolean;
}

export const ElementPreview: React.FC<ElementPreviewProps> = ({
  tool,
  x = 0,
  y = 0,
  size = 40,
  visible = true,
}) => {
  if (!visible) return null;

  // Mapeia Tool -> Element "fake" para preview
  const element = {
    id: "preview",
    type: tool as any, // garante compatibilidade
    x: 0,
    y: 0,
    width: size,
    height: size,
    name: "",
  };

  return (
    <Group x={x} y={y} opacity={0.7} listening={false}>
      <GaphorIcon
        element={element}
        x={0}
        y={0}
        width={size}
        height={size}
        isSelected={false}
      />
    </Group>
  );
};
