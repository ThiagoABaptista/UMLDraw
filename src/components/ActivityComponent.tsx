import React from 'react';
import { Group, Rect, Circle, Path } from 'react-konva';
import { EditableText } from './EditableText';
import { ActivityElement } from '../types/umlTypes';

// SVG paths do Lucide (https://lucide.dev/icons)
const PLAY_PATH = "M6 4l20 12-20 12V4z";
const CIRCLEDOT_PATH = "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6z";

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

  const renderActivity = () => (
    <Rect
      width={element.width}
      height={element.height}
      fill="#e0f2fe"
      stroke={isSelected ? "#0284c7" : "#0369a1"}
      strokeWidth={isSelected ? 3 : 2}
      cornerRadius={6}
      shadowColor={isSelected ? "#38bdf8" : undefined}
      shadowBlur={isSelected ? 8 : 0}
      shadowOpacity={isSelected ? 0.25 : 0}
    />
  );

  const renderDecision = () => (
    <Rect
      width={element.width}
      height={element.height}
      fill="#fef9c3"
      stroke={isSelected ? "#f59e0b" : "#d97706"}
      strokeWidth={isSelected ? 3 : 2}
      rotation={45}
      offsetX={element.width / 2}
      offsetY={element.height / 2}
      shadowColor={isSelected ? "#fbbf24" : undefined}
      shadowBlur={isSelected ? 8 : 0}
      shadowOpacity={isSelected ? 0.25 : 0}
    />
  );

  const renderStartEnd = () => (
    <Circle
      x={element.width / 2}
      y={element.height / 2}
      radius={element.width / 2}
      fill={element.type === 'start' ? "#22c55e" : "#dc2626"}
      stroke={isSelected ? (element.type === 'start' ? "#16a34a" : "#991b1b") : (element.type === 'start' ? "#047857" : "#7f1d1d")}
      strokeWidth={isSelected ? 3 : 2}
      shadowColor={isSelected ? (element.type === 'start' ? "#22c55e" : "#dc2626") : undefined}
      shadowBlur={isSelected ? 8 : 0}
      shadowOpacity={isSelected ? 0.25 : 0}
    />
  );

  const renderForkJoin = () => (
    <Rect
      width={element.width}
      height={element.height}
      fill="#111827"
      stroke={isSelected ? "#6b7280" : "#374151"}
      strokeWidth={isSelected ? 3 : 2}
      shadowColor={isSelected ? "#6b7280" : undefined}
      shadowBlur={isSelected ? 6 : 0}
      shadowOpacity={isSelected ? 0.2 : 0}
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
          fontSize={14}
          fill="#111827"
          backgroundColor="transparent"
          onEditEnd={handleEdit}
          isEditing={element.isEditing && isSelected}
          align="center"
        />
      )}
      
      {element.type === 'start' && (
        <Path
          data={PLAY_PATH}
          x={element.width / 2 - 8}
          y={element.height / 2 - 10}
          scale={{ x: 0.6, y: 0.6 }}
          fill="white"
          listening={false}
        />
      )}
      
      {element.type === 'end' && (
        <Path
          data={CIRCLEDOT_PATH}
          x={element.width / 2 - 10}
          y={element.height / 2 - 10}
          scale={{ x: 0.7, y: 0.7 }}
          fill="white"
          listening={false}
        />
      )}
    </Group>
  );
};
