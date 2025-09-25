import React from "react";
import { Group } from "react-konva";
import { UseCaseElement } from "../types/umlTypes";
import { GaphorIcon } from "./GaphorIcon";
import { EditableText } from "./EditableText";

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
  isSelected,
}) => {
  const handleEdit = (newName: string) => {
    onTextEdit(element.id, newName);
  };

  console.log("Rendering UseCaseComponent:", element);

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

      {/* Texto editável para elementos de caso de uso */}
      {(element.type === "actor" || element.type === "usecase") && (
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