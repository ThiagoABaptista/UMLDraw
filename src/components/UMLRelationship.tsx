import React from 'react';
import { Arrow, Group, Text } from 'react-konva';
import { UMLRelationship, UseCaseElement, ActivityElement } from '../types/umlTypes';
import { getBorderPoint } from '../utils/geometry';

interface UMLRelationshipProps {
  relationship: UMLRelationship;
  fromElement: UseCaseElement | ActivityElement;
  toElement: UseCaseElement | ActivityElement;
  isSelected: boolean;
  onClick: (id: string) => void;
  diagramType: 'usecase' | 'activity';
}

export const UMLRelationshipComponent: React.FC<UMLRelationshipProps> = ({
  relationship,
  fromElement,
  toElement,
  isSelected,
  onClick,
  diagramType
}) => {
  const getArrowConfig = () => {
    switch (relationship.type) {
      case 'association':
        return { pointerLength: 10, pointerWidth: 10, fill: '#111827', dash: [], stroke: '#111827' }; // Linha sólida
      case 'include':
        return { pointerLength: 10, pointerWidth: 10, fill: '#111827', dash: [6, 4], stroke: '#111827', label: '<<include>>' }; // Linha tracejada com estereótipo
      case 'extend':
        return { pointerLength: 10, pointerWidth: 10, fill: '#111827', dash: [6, 4], stroke: '#111827', label: '<<extend>>' }; // Linha tracejada com estereótipo
      case 'generalization':
        return { pointerLength: 15, pointerWidth: 15, fill: 'white', stroke: '#111827', pointerClosed: false, pointerAtEnding: true }; // Linha sólida com ponta de flecha aberta
      case 'dependency':
        return { pointerLength: 10, pointerWidth: 10, fill: '#111827', dash: [6, 4], stroke: '#111827' }; // Linha tracejada com ponta de flecha fechada
      case 'control_flow':
        return { pointerLength: 10, pointerWidth: 10, fill: '#111827', dash: [], stroke: '#111827' }; // Linha sólida com ponta de flecha fechada
      case 'object_flow':
        return { pointerLength: 10, pointerWidth: 10, fill: '#111827', dash: [6, 4], stroke: '#111827' }; // Linha tracejada com ponta de flecha fechada
      default:
        return { pointerLength: 10, pointerWidth: 10, fill: '#111827', dash: [], stroke: '#111827' };
    }
  };

  const fromCenter = {
    x: fromElement.x + fromElement.width / 2,
    y: fromElement.y + fromElement.height / 2
  };
  const toCenter = {
    x: toElement.x + toElement.width / 2,
    y: toElement.y + toElement.height / 2
  };

  const from = getBorderPoint(fromElement.x, fromElement.y, fromElement.width, fromElement.height, toCenter.x, toCenter.y);
  const to = getBorderPoint(toElement.x, toElement.y, toElement.width, toElement.height, fromCenter.x, fromCenter.y);

  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  const arrowConfig = getArrowConfig();

  return (
    <Group
      onClick={() => onClick(relationship.id)}
      onTap={() => onClick(relationship.id)}
    >
      <Arrow
        points={[from.x, from.y, to.x, to.y]}
        pointerLength={arrowConfig.pointerLength}
        pointerWidth={arrowConfig.pointerWidth}
        fill={arrowConfig.fill}
        stroke={isSelected ? "#3b82f6" : arrowConfig.stroke}
        strokeWidth={isSelected ? 3 : 2}
        dash={arrowConfig.dash}
        pointerAtEnding={arrowConfig.pointerAtEnding}
        pointerClosed={arrowConfig.pointerClosed}
      />
      {arrowConfig.label && (
        <Text
          x={midX - 30}
          y={midY - 20}
          text={arrowConfig.label}
          fontSize={12}
          fill="#374151"
          fontStyle="italic"
        />
      )}
      {relationship.guard && (
        <Text
          x={midX + 10}
          y={midY - 20}
          text={`[${relationship.guard}]`}
          fontSize={12}
          fill="#374151"
          fontStyle="italic"
        />
      )}
      {relationship.label && (
        <Text
          x={midX - 20}
          y={midY - 10}
          text={relationship.label}
          fontSize={12}
          fill="#374151"
          fontStyle="italic"
        />
      )}
    </Group>
  );
};