import React from "react";
import { Group } from "react-konva";
import Konva from "konva";
import { EditableText } from "./EditableText";
import { GaphorIcon } from "./GaphorIcon";
import { ActivityElement } from "../types/umlTypes";

interface ActivityComponentProps {
  element: ActivityElement;
  onDragMove?: (id: string, x: number, y: number) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onClick: (id: string) => void;
  onTextEdit: (id: string, value: string) => void;
  isSelected: boolean;
}

export const ActivityComponent: React.FC<ActivityComponentProps> = ({
  element,
  onDragMove,
  onDragEnd,
  onClick,
  onTextEdit,
  isSelected,
}) => {
  const handleEdit = (newName: string) => onTextEdit(element.id, newName);

  const getTextPosition = () => {
    switch (element.type) {
      case "activity":
        return { x: 0, y: element.height / 2 - 8, width: element.width, showText: true };
      case "decision":
        return { x: 0, y: element.height / 2 - 8, width: element.width, showText: true };
      default:
        return { x: 0, y: element.height / 2 - 8, width: element.width, showText: false };
    }
  };

  const textPosition = getTextPosition();

  return (
    <Group
      x={element.x}
      y={element.y}
      draggable
      onDragMove={(e: Konva.KonvaEventObject<DragEvent>) => {
        onDragMove?.(element.id, e.target.x(), e.target.y());
      }}
      onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
        onDragEnd(element.id, e.target.x(), e.target.y());
      }}
      onClick={() => onClick(element.id)}
      listening={true}
    >
      <GaphorIcon
        element={element}
        x={0}
        y={0}
        width={element.width}
        height={element.height}
        isSelected={isSelected}
      />

      {textPosition.showText && (
        <EditableText
          x={textPosition.x}
          y={textPosition.y}
          width={textPosition.width}
          text={element.name}
          fontSize={12}
          fill="#111827"
          backgroundColor="transparent"
          onEditEnd={handleEdit}
          isEditing={element.isEditing && isSelected}
          align="center"
        />
      )}
    </Group>
  );
};
