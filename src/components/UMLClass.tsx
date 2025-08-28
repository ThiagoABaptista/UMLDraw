import React from 'react';
import { Group, Rect } from 'react-konva';
import { EditableText } from './EditableText';
import { UMLClass } from '../types/umlTypes';

interface UMLClassProps {
  umlClass: UMLClass;
  onDragEnd: (id: string, x: number, y: number) => void;
  onClick: (id: string) => void;
  onTextEdit: (id: string, field: 'name' | 'attributes' | 'methods', value: string) => void;
  isSelected: boolean;
}

export const UMLClassComponent: React.FC<UMLClassProps> = ({
  umlClass,
  onDragEnd,
  onClick,
  onTextEdit,
  isSelected
}) => {
  const handleNameEdit = (newName: string) => {
    onTextEdit(umlClass.id, 'name', newName);
  };

  const handleAttributesEdit = (newAttributes: string) => {
    onTextEdit(umlClass.id, 'attributes', newAttributes);
  };

  const handleMethodsEdit = (newMethods: string) => {
    onTextEdit(umlClass.id, 'methods', newMethods);
  };

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
      
      <EditableText
        x={10}
        y={5}
        width={umlClass.width - 20}
        text={umlClass.name}
        fontSize={16}
        fontStyle="bold"
        fill="white"
        onEditEnd={handleNameEdit}
        isEditing={umlClass.isEditing && isSelected}
      />
      
      <EditableText
        x={10}
        y={40}
        width={umlClass.width - 20}
        text={umlClass.attributes.join('\n')}
        fontSize={14}
        fill="#374151"
        onEditEnd={handleAttributesEdit}
        isEditing={umlClass.isEditing && isSelected}
      />
      
      {umlClass.methods.length > 0 && (
        <EditableText
          x={10}
          y={40 + umlClass.attributes.length * 20 + 10}
          width={umlClass.width - 20}
          text={umlClass.methods.join('\n')}
          fontSize={14}
          fill="#374151"
          onEditEnd={handleMethodsEdit}
          isEditing={umlClass.isEditing && isSelected}
        />
      )}
    </Group>
  );
};