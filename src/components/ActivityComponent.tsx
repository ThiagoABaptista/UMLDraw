import React from 'react';
import { Group, Rect, Circle, Text } from 'react-konva';
import { EditableText } from './EditableText';
import { ActivityElement } from '../types/umlTypes';

interface ActivityComponentProps {
  element: ActivityElement;
  onDragEnd: (id: string, x: number, y: number) => void;
  onClick: (id: string) => void;
  onTextEdit: (id: string, value: string) => void;
  isSelected: boolean;
}

export const ActivityComponent: React.FC<ActivityComponentProps> = ({
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

  const renderActivity = () => (
    <Rect
      width={element.width}
      height={element.height}
      fill="#fef3c7"
      stroke={isSelected ? "#f59e0b" : "#d97706"}
      strokeWidth={isSelected ? 3 : 2}
      cornerRadius={8}
      shadowColor={isSelected ? "#f59e0b" : undefined}
      shadowBlur={isSelected ? 10 : 0}
      shadowOpacity={isSelected ? 0.3 : 0}
    />
  );

  const renderDecision = () => (
    <Group>
      <Rect
        width={element.width}
        height={element.height}
        fill="#fef3c7"
        stroke={isSelected ? "#f59e0b" : "#d97706"}
        strokeWidth={isSelected ? 3 : 2}
        rotation={45}
        offsetX={element.width / 2}
        offsetY={element.height / 2}
        shadowColor={isSelected ? "#f59e0b" : undefined}
        shadowBlur={isSelected ? 10 : 0}
        shadowOpacity={isSelected ? 0.3 : 0}
      />
    </Group>
  );

  const renderStartEnd = () => (
    <Circle
      x={element.width / 2}
      y={element.height / 2}
      radius={element.width / 2}
      fill={element.type === 'start' ? "#10b981" : "#ef4444"}
      stroke={isSelected ? (element.type === 'start' ? "#059669" : "#dc2626") : (element.type === 'start' ? "#047857" : "#b91c1c")}
      strokeWidth={isSelected ? 3 : 2}
      shadowColor={isSelected ? (element.type === 'start' ? "#10b981" : "#ef4444") : undefined}
      shadowBlur={isSelected ? 10 : 0}
      shadowOpacity={isSelected ? 0.3 : 0}
    />
  );

  const renderForkJoin = () => (
    <Rect
      width={element.width}
      height={element.height}
      fill="#d1d5db"
      stroke={isSelected ? "#6b7280" : "#4b5563"}
      strokeWidth={isSelected ? 3 : 2}
      shadowColor={isSelected ? "#6b7280" : undefined}
      shadowBlur={isSelected ? 10 : 0}
      shadowOpacity={isSelected ? 0.3 : 0}
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
      {element.type === 'activity' && renderActivity()}
      {element.type === 'decision' && renderDecision()}
      {(element.type === 'start' || element.type === 'end') && renderStartEnd()}
      {(element.type === 'fork' || element.type === 'join' || element.type === 'merge') && renderForkJoin()}
      
      {(element.type === 'activity' || element.type === 'decision') && (
        <EditableText
          x={10}
          y={element.height / 2 - 10}
          width={element.width - 20}
          text={element.name}
          fontSize={12}
          fill="#111827"
          backgroundColor="transparent"
          onEditStart={handleEditStart}
          onEditEnd={handleEdit}
          isEditing={element.isEditing && isSelected}
          align="center"
        />
      )}
      
      {element.type === 'start' && (
        <Text
          x={element.width / 2 - 5}
          y={element.height / 2 - 8}
          text="▶"
          fontSize={16}
          fill="white"
          align="center"
          listening={false}
        />
      )}
      
      {element.type === 'end' && (
        <Text
          x={element.width / 2 - 8}
          y={element.height / 2 - 10}
          text="●"
          fontSize={20}
          fill="white"
          align="center"
          listening={false}
        />
      )}
    </Group>
  );
};