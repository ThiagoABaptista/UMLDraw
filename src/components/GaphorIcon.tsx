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

  if (!svgContent) {
    // fallback simples (você já tinha um fallback antes)
    return null;
  }

  try {
    const { paths, viewBox, translate } = parseSvgContent(svgContent);
    const color = umlSvgColors[element.type] || "#111827";

    if (paths.length === 0) {
      return null;
    }

    // escala para caber na caixa (mantendo ratio)
    const defaults = getElementDefaults(element.type);
    const baseScale = Math.min(width / viewBox.width, height / viewBox.height);
    const scale = baseScale * defaults.scaleBoost;
    const finalWidth = viewBox.width * scale;
    const finalHeight = viewBox.height * scale;
    // offset para centralizar o viewBox dentro da caixa desejada
    const offsetX = (width - finalWidth) / 2;
    const offsetY = (height - finalHeight) / 2;

    // translate acumulada do SVG (normalmente valores negativos como -44, -19 no Gaphor)
    const tx = translate.x;
    const ty = translate.y;

    return (
      <Group
        x={x + offsetX}
        y={y + offsetY}
        scaleX={scale}
        scaleY={scale}
        // importante: não colocamos draggable aqui — o draggable está nos componentes pais
      >
        {paths.map((d, idx) => (
          <Path
            key={idx}
            data={d}
            // aplica compensação da translate do SVG e do viewBox.min
            x={tx - viewBox.minX}
            y={ty - viewBox.minY}
            fill={color}
            stroke={isSelected ? "#6366f1" : "transparent"}
            strokeWidth={isSelected ? 2 / Math.max(scale, 0.0001) : 0}
            perfectDrawEnabled={false}
            listening={true} // permite clicar/arrastar sobre o próprio ícone (events sobem para o Group pai)
          />
        ))}

        {/* DEBUG: mostra área do viewBox */}
        <Rect
          x={0}
          y={0}
          width={viewBox.width}
          height={viewBox.height}
          stroke="red"
          strokeWidth={0.2 / Math.max(scale, 0.0001)}
          listening={false}
        />
      </Group>
    );
  } catch (error) {
    console.error("Erro ao renderizar GaphorIcon:", error);
    return null;
  }
};
