import React from 'react';
import { Group, Rect, Circle, Text } from 'react-konva';
import { EditableText } from './EditableText';
import { UseCaseElement } from '../types/umlTypes';

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

  const handleEditStart = () => {
    // Lógica opcional quando a edição inicia
  };

  const renderActor = () => (
    <Group>
      {/* Corpo do ator */}
      <Circle
        x={element.width / 2}
        y={20}
        radius={15}
        fill="#3b82f6"
        stroke={isSelected ? "#2563eb" : "#1d4ed8"}
        strokeWidth={isSelected ? 3 : 2}
      />
      
      {/* Corpo */}
      <Rect
        x={element.width / 2 - 20}
        y={35}
        width={40}
        height={40}
        fill="#3b82f6"
        stroke={isSelected ? "#2563eb" : "#1d4ed8"}
        strokeWidth={isSelected ? 3 : 2}
      />
      
      {/* Pernas */}
      <Rect
        x={element.width / 2 - 15}
        y={75}
        width={30}
        height={25}
        fill="#3b82f6"
        stroke={isSelected ? "#2563eb" : "#1d4ed8"}
        strokeWidth={isSelected ? 3 : 2}
      />
    </Group>
  );

  const renderUseCase = () => (
    <Group>
      {/* Elipse do caso de uso */}
      <Rect
        width={element.width}
        height={element.height}
        fill="#dbeafe"
        stroke={isSelected ? "#3b82f6" : "#111827"}
        strokeWidth={isSelected ? 3 : 2}
        cornerRadius={element.height / 2}
        shadowColor={isSelected ? "#3b82f6" : undefined}
        shadowBlur={isSelected ? 10 : 0}
        shadowOpacity={isSelected ? 0.3 : 0}
      />
    </Group>
  );

  const renderSystem = () => (
    <Group>
      {/* Retângulo do sistema */}
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
        shadowOpacity={isSelected ? 0.3 : 0}
      />
    </Group>
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
        y={element.type === 'actor' ? element.height + 5 : element.height / 2 - 10}
        width={element.width - 20}
        text={element.name}
        fontSize={element.type === 'actor' ? 12 : 14}
        fontStyle={element.type === 'actor' ? 'normal' : 'normal'}
        fill={element.type === 'actor' ? '#374151' : '#111827'}
        backgroundColor={element.type === 'actor' ? 'transparent' : 'transparent'}
        onEditStart={handleEditStart}
        onEditEnd={handleEdit}
        isEditing={element.isEditing && isSelected}
        align={element.type === 'actor' ? 'center' : 'center'}
      />
    </Group>
  );
};