import React from 'react';
import { Arrow } from 'react-konva';
import { UMLRelationship } from '../types/umlTypes';

interface UMLRelationshipProps {
  relationship: UMLRelationship;
  from: { x: number; y: number };
  to: { x: number; y: number };
  isSelected: boolean;
  onClick: (id: string) => void;
}

export const UMLRelationshipComponent: React.FC<UMLRelationshipProps> = ({
  relationship,
  from,
  to,
  isSelected,
  onClick
}) => {
  const getArrowConfig = () => {
    switch (relationship.type) {
      case 'inheritance':
        return { pointerLength: 15, pointerWidth: 15, fill: '#111827' };
      case 'composition':
        return { pointerLength: 15, pointerWidth: 15, fill: '#111827' };
      default:
        return { pointerLength: 10, pointerWidth: 10, fill: '#111827' };
    }
  };

  return (
    <Arrow
      points={[from.x, from.y, to.x, to.y]}
      {...getArrowConfig()}
      stroke={isSelected ? "#3b82f6" : "#111827"}
      strokeWidth={isSelected ? 3 : 2}
      onClick={() => onClick(relationship.id)}
      onTap={() => onClick(relationship.id)}
    />
  );
};