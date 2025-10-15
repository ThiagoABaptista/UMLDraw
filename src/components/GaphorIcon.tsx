import React from "react";
import { Group, Rect } from "react-konva";
import { ActivityElement, UseCaseElement } from "../types/umlTypes";
import { umlSvgColors } from "../types/umlSvgColors";
import { getElementDefaults } from "../utils/diagramDefaults";

// Funções de desenho baseadas no canvas
import {
  drawActor,
  drawUseCase,
  drawActivity,
  drawStart,
  drawEnd,
  drawDecision,
  drawMerge,
  drawFork,
  drawJoin,
} from "./UMLShapes";

interface GaphorIconProps {
  element: UseCaseElement | ActivityElement;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected?: boolean;
}

/**
 * 🧠 GaphorIcon - desenha os ícones UML diretamente no Canvas (Konva)
 */
export const GaphorIcon: React.FC<GaphorIconProps> = ({
  element,
  x,
  y,
  width,
  height,
  isSelected = false,
}) => {
  const defaults = getElementDefaults(element.type);
  const color = umlSvgColors[element.type] || "#111827";
  const scale = defaults.scaleBoost ?? 1.0;
  const strokeWidth = Math.max(1, 1.5 * scale);

  // 🔁 Escolhe a função de desenho conforme o tipo UML
  const renderShape = () => {
    console.log("Rendering shape:", element.type, { width, height, scale });
    switch (element.type) {
      case "actor":
        return drawActor(x, y, width, height, color, strokeWidth, isSelected);
      case "usecase":
        return drawUseCase(x, y, width, height, color, strokeWidth, isSelected);
      case "activity":
        return drawActivity(x, y, width, height, color, strokeWidth, isSelected);
      case "decision":
        return drawDecision(x, y, width, height, color, strokeWidth, isSelected);
      case "start":
        return drawStart(x, y, width, height, color, strokeWidth, isSelected);
      case "end":
        return drawEnd(x, y, width, height, color, strokeWidth, isSelected);
      case "fork":
        return drawFork(x, y, width, height, color, strokeWidth, isSelected);
      case "join":
        return drawJoin(x, y, width, height, color, strokeWidth, isSelected);
      case "merge":
        return drawMerge(x, y, width, height, color, strokeWidth, isSelected);

      default:
        return (
          <Group x={x} y={y} listening>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              stroke={color}
              strokeWidth={strokeWidth}
              fillEnabled={false}
            />
          </Group>
        );
    }
  };

  return renderShape();
};
