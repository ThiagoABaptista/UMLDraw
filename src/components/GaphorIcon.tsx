import React from "react";
import { Group, Path, Rect } from "react-konva";
import { ActivityElement, UseCaseElement } from "../types/umlTypes";
import { umlSvgContent } from "../utils/iconMapping";
import { umlSvgColors } from "../types/umlSvgColors";
import { parseSvgContent } from "../utils/svgParser";
import { getElementDefaults } from "../utils/diagramDefaults";

interface GaphorIconProps {
  element: UseCaseElement | ActivityElement;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected?: boolean;
}

export const GaphorIcon: React.FC<GaphorIconProps> = ({
  element,
  x,
  y,
  width,
  height,
  isSelected = false,
}) => {
  const svgContent = umlSvgContent[element.type];
  if (!svgContent) return null;

  try {
    const { paths, viewBox, translate } = parseSvgContent(svgContent);
    const color = umlSvgColors[element.type] || "#111827";
    if (paths.length === 0) return null;

    const defaults = getElementDefaults(element.type);
    const baseScale = Math.min(width / viewBox.width, height / viewBox.height);
    const scale = baseScale * defaults.scaleBoost;

    const finalWidth = viewBox.width * scale;
    const finalHeight = viewBox.height * scale;
    const offsetX = (width - finalWidth) / 2;
    const offsetY = (height - finalHeight) / 2;

    const tx = translate.x - viewBox.minX;
    const ty = translate.y - viewBox.minY;

    return (
      <Group
        x={x + offsetX}
        y={y + offsetY}
        scaleX={scale}
        scaleY={scale}
        listening={true}
      >
        {paths.map((d, idx) => (
          <Path
            key={idx}
            data={d}
            x={tx}
            y={ty}
            fill={color}
            stroke={isSelected ? "#6366f1" : "transparent"}
            strokeWidth={isSelected ? 2 / Math.max(scale, 0.0001) : 0}
            perfectDrawEnabled={false}
            listening={true}
          />
        ))}

        {/* Mantém o Rect de debug visível mas leve */}
        <Rect
          x={0}
          y={0}
          width={viewBox.width}
          height={viewBox.height}
          stroke="red"
          strokeWidth={0.15 / Math.max(scale, 0.0001)}
          listening={false}
        />
      </Group>
    );
  } catch (err) {
    console.error("❌ Erro ao renderizar GaphorIcon:", err);
    return null;
  }
};
