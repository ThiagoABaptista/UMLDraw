import React from "react";
import { Group } from "react-konva";
import { Tool } from "../types/umlTypes";
import { ElementIcon } from "./ElementIcon";
import { getElementDefaults } from "../utils/diagramDefaults";

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

  // Pega os tamanhos padrão do elemento
  const defaults = getElementDefaults(tool);
  const width = defaults.width;
  const height = defaults.height;

  // Cria um elemento "fake" apenas para o preview
  const element = {
    id: "preview",
    type: tool as any,
    x: 0,
    y: 0,
    width,
    height,
    name: "",
  };

  return (
    <Group
      x={x - width / 2}
      y={y - height / 2}
      opacity={0.7}
      listening={false}
    >
      <ElementIcon
        element={element}
        x={0}
        y={0}
        width={width}
        height={height}
        isSelected={false}
      />
    </Group>
  );
};
