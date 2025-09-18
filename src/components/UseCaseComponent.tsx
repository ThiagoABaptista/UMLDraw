import React from 'react';
import { Group, Rect, Path } from 'react-konva';
import { EditableText } from './EditableText';
import { UseCaseElement } from '../types/umlTypes';

// Lucide path
const USER_PATH = "M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.33 0-8 2.17-8 5v3h16v-3c0-2.83-3.67-5-8-5z";

interface UseCaseComponentProps {
  element: UseCaseElement;
  onDragEnd: (id: string, x: number, y: number) => void;
  onClick: (id: string) => void;
  onTextEdit: (id: string, value: string) => void;
  isSelected: boolean;
}

export const UseCaseComponent: React.FC<UseCaseComponentProps> = ({
  element,
  onDragEnd,
  onClick,
  onTextEdit,
  isSelected
}) => {
  const handleEdit = (newName: string) => {
    onTextEdit(element.id, newName);
  };

  const renderActor = () => (
    <Path
      data={USER_PATH}
      x={element.width / 2 - 14}
      y={0}
      scale={{ x: 1.5, y: 1.5 }}
      fill={isSelected ? "#2563eb" : "#1d4ed8"}
      stroke={isSelected ? "#2563eb" : "#1d4ed8"}
      strokeWidth={1.5}
    />
  );

  const renderUseCase = () => (
    <Rect
      width={element.width}
      height={element.height}
      fill="#dbeafe"
      stroke={isSelected ? "#3b82f6" : "#1e3a8a"}
      strokeWidth={isSelected ? 3 : 2}
      cornerRadius={element.height / 2}
      shadowColor={isSelected ? "#3b82f6" : undefined}
      shadowBlur={isSelected ? 10 : 0}
      shadowOpacity={isSelected ? 0.25 : 0}
    />
  );

  const renderSystem = () => (
    <Rect
      width={element.width}
      height={element.height}
      fill="#f0f9ff"
      stroke={isSelected ? "#0ea5e9" : "#0369a1"}
      strokeWidth={isSelected ? 3 : 2}
      cornerRadius={8}
      dash={[5, 5]}
      shadowColor={isSelected ? "#0ea5e9" : undefined}
      shadowBlur={isSelected ? 10 : 0}
      shadowOpacity={isSelected ? 0.25 : 0}
    />
  );

  return (
    <Group
      x={element.x}
      y={element.y}
      draggable
      onDragEnd={(e) => onDragEnd(element.id, e.target.x(), e.target.y())}
      onClick={() => onClick(element.id)}
      onTap={() => onClick(element.id)}
    >
      {element.type === 'actor' && renderActor()}
      {element.type === 'usecase' && renderUseCase()}
      {element.type === 'system' && renderSystem()}
      
      <EditableText
        x={10}
        y={element.type === 'actor' ? element.height + 10 : element.height / 2 - 10}
        width={element.width - 20}
        text={element.name}
        fontSize={element.type === 'actor' ? 12 : 14}
        fill="#111827"
        backgroundColor="transparent"
        onEditEnd={handleEdit}
        isEditing={element.isEditing && isSelected}
        align="center"
      />
    </Group>
  );
};
