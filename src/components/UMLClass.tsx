import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { UMLClass } from '../types/umlTypes';

interface UMLClassProps {
  umlClass: UMLClass;
  onDragEnd: (id: string, x: number, y: number) => void;
  onClick: (id: string) => void;
  isSelected: boolean;
}

export const UMLClassComponent: React.FC<UMLClassProps> = ({
  umlClass,
  onDragEnd,
  onClick,
  isSelected
}) => {
  return (
    <Group
      x={umlClass.x}
      y={umlClass.y}
      draggable
      onDragEnd={(e) => onDragEnd(umlClass.id, e.target.x(), e.target.y())}
      onClick={() => onClick(umlClass.id)}
      onTap={() => onClick(umlClass.id)}
    >
      <Rect
        width={umlClass.width}
        height={umlClass.height}
        fill="#dbeafe"
        stroke={isSelected ? "#3b82f6" : "#111827"}
        strokeWidth={isSelected ? 3 : 2}
        cornerRadius={6}
        shadowColor={isSelected ? "#3b82f6" : undefined}
        shadowBlur={isSelected ? 10 : 0}
        shadowOpacity={isSelected ? 0.3 : 0}
      />
      
      <Rect
        width={umlClass.width}
        height={30}
        fill="#3b82f6"
        cornerRadius={[6, 6, 0, 0]}
      />
      
      <Text
        text={umlClass.name}
        x={10}
        y={5}
        fontSize={16}
        fontStyle="bold"
        fill="white"
        width={umlClass.width - 20}
        ellipsis
      />
      
      <Text
        text={umlClass.attributes.join('\n')}
        x={10}
        y={40}
        fontSize={14}
        fill="#374151"
        width={umlClass.width - 20}
      />
      
      {umlClass.methods.length > 0 && (
        <Text
          text={umlClass.methods.join('\n')}
          x={10}
          y={40 + umlClass.attributes.length * 20 + 10}
          fontSize={14}
          fill="#374151"
          width={umlClass.width - 20}
        />
      )}
    </Group>
  );
};