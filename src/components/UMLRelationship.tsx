import React from "react";
import { Arrow, Group, Text } from "react-konva";
import {
  UMLRelationship,
  UseCaseElement,
  ActivityElement,
} from "../types/umlTypes";
import { getBorderPoint } from "../utils/geometry";
import { umlSvgColors } from "../types/umlSvgColors";

interface UMLRelationshipProps {
  relationship: UMLRelationship;
  fromElement: UseCaseElement | ActivityElement;
  toElement: UseCaseElement | ActivityElement;
  isSelected: boolean;
  onClick: (id: string) => void;
  diagramType: "usecase" | "activity";
}

/**
 * 🎯 Desenha as relações UML no canvas (Konva)
 * - Inclui setas, linhas tracejadas e rótulos
 */
export const UMLRelationshipComponent: React.FC<UMLRelationshipProps> = ({
  relationship,
  fromElement,
  toElement,
  isSelected,
  onClick,
  diagramType,
}) => {
  // 🎨 Define estilo da seta conforme o tipo de relação
  const getArrowConfig = () => {
    const baseColor = umlSvgColors[relationship.type] || "#111827";
    const stroke = isSelected ? "#3b82f6" : baseColor;
    const fill = relationship.type === "generalization" ? "white" : stroke;

    switch (relationship.type) {
      case "association":
        return { stroke, fill, dash: [], pointerClosed: true };
      case "include":
        return { stroke, fill, dash: [6, 4], pointerClosed: true };
      case "extend":
        return { stroke, fill, dash: [6, 4], pointerClosed: true };
      case "dependency":
        return { stroke, fill, dash: [6, 4], pointerClosed: true };
      case "control_flow":
        return { stroke, fill, dash: [], pointerClosed: true };
      case "object_flow":
        return { stroke, fill, dash: [6, 4], pointerClosed: true };
      case "generalization":
        return { stroke, fill, dash: [], pointerClosed: false };
      default:
        return { stroke, fill, dash: [], pointerClosed: true };
    }
  };

  const fromCenter = {
    x: fromElement.x + fromElement.width / 2,
    y: fromElement.y + fromElement.height / 2,
  };
  const toCenter = {
    x: toElement.x + toElement.width / 2,
    y: toElement.y + toElement.height / 2,
  };

  const from = getBorderPoint(
    fromElement.x,
    fromElement.y,
    fromElement.width,
    fromElement.height,
    toCenter.x,
    toCenter.y
  );
  const to = getBorderPoint(
    toElement.x,
    toElement.y,
    toElement.width,
    toElement.height,
    fromCenter.x,
    fromCenter.y
  );

  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  const arrowConfig = getArrowConfig();

  return (
    <Group
      onClick={() => onClick(relationship.id)}
      onTap={() => onClick(relationship.id)}
      listening
    >
      <Arrow
        points={[from.x, from.y, to.x, to.y]}
        pointerLength={12}
        pointerWidth={12}
        fill={arrowConfig.fill}
        stroke={arrowConfig.stroke}
        strokeWidth={isSelected ? 3 : 2}
        dash={arrowConfig.dash}
        pointerAtEnding
        pointerClosed={arrowConfig.pointerClosed}
        shadowColor={isSelected ? "#3b82f6" : "transparent"}
        shadowBlur={isSelected ? 8 : 0}
        shadowOpacity={isSelected ? 0.2 : 0}
      />

      {/* 💬 Label principal (ex: <<include>>, <<extend>>) */}
      {relationship.label && (
        <Text
          x={midX - 25}
          y={midY - 10}
          text={relationship.label}
          fontSize={12}
          fill="#374151"
          fontStyle="italic"
        />
      )}

      {/* ⚙️ Guarda condicional (ex: [condição]) */}
      {relationship.guard && (
        <Text
          x={midX + 10}
          y={midY - 22}
          text={`[${relationship.guard}]`}
          fontSize={12}
          fill="#6b7280"
          fontStyle="italic"
        />
      )}
    </Group>
  );
};
