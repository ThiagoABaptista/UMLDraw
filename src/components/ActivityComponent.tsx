import React from "react";
import { Group } from "react-konva";
import { EditableText } from "./EditableText";
import { GaphorIcon } from "./GaphorIcon";
import { ActivityElement } from "../types/umlTypes";

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
  isSelected,
}) => {
  const handleEdit = (newName: string) => {
    onTextEdit(element.id, newName);
  };

  return (
    <Group
      x={element.x}
      y={element.y}
      draggable
      onDragEnd={(e) => onDragEnd(element.id, e.target.x(), e.target.y())}
      onClick={() => onClick(element.id)}
      onTap={() => onClick(element.id)}
    >
      <GaphorIcon 
        element={element}
        x={0}
        y={0}
        width={element.width}
        height={element.height}
      />

      {(element.type === "activity" || element.type === "decision") && (
        <EditableText
          x={10}
          y={element.height / 2 - 10}
          width={element.width - 20}
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