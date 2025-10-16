import React from "react";
import { Arrow, Group, Text } from "react-konva";
import {
  UMLRelationship,
  UseCaseElement,
  ActivityElement,
} from "../types/umlTypes";
import { getBorderPoint } from "../utils/geometry";

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
 */
export const UMLRelationshipComponent: React.FC<UMLRelationshipProps> = ({
  relationship,
  fromElement,
  toElement,
  isSelected,
  onClick,
  diagramType,
}) => {
  // 🖤 Cor base escura (fica azul apenas quando selecionado)
  const baseColor = isSelected ? "#3b82f6" : "#1f2937";

  // 🔄 Inverte direção da seta para tipos específicos
  const isReversed =
    relationship.type === "extend" ||
    relationship.type === "dependency" ||
    relationship.type === "object_flow";

  // 🎨 Define estilo visual da seta conforme o tipo
  const getArrowConfig = () => {
    const stroke = baseColor;
    const fill = relationship.type === "generalization" ? "white" : stroke;

    switch (relationship.type) {
      case "association":
      case "control_flow":
        return { stroke, fill, dash: [], pointerClosed: true };
      case "include":
      case "extend":
      case "dependency":
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

  // 📍 Calcula pontos de conexão entre shapes
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

  // 🔄 Inverte os pontos quando necessário
  const start = isReversed ? to : from;
  const end = isReversed ? from : to;

  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  const arrowConfig = getArrowConfig();

  // 🔤 Label automático para <<include>> e <<extend>>
  const displayLabel =
    relationship.label ||
    (relationship.type === "include"
      ? "<<include>>"
      : relationship.type === "extend"
      ? "<<extend>>"
      : "");

  return (
    <Group
      key={`${relationship.id}-${relationship.type}-${isSelected}`}
      onClick={() => onClick(relationship.id)}
      onTap={() => onClick(relationship.id)}
      listening
    >
      <Arrow
        points={[start.x, start.y, end.x, end.y]}
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
        shadowOpacity={isSelected ? 0.3 : 0}
      />

      {/* 💬 Label principal (<<include>>, <<extend>> ou custom) */}
      {displayLabel && (
        <Text
          x={midX - displayLabel.length * 2.5}
          y={midY - 10}
          text={displayLabel}
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
