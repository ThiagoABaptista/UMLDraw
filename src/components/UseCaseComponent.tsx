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

  // Reposicionamento do texto
  const getTextPosition = () => {
    switch (element.type) {
      case "actor":
        return {
          x: 0,
          y: element.height + 6, // texto sempre abaixo do ícone
          width: element.width,
        };
      case "usecase":
        return {
          x: 10,
          y: element.height / 2 - 10, // centralizado na elipse
          width: element.width - 20,
        };
      default:
        return {
          x: 0,
          y: element.height + 6,
          width: element.width,
        };
    }
  };

  const textPos = getTextPosition();

  return (
    <Group
      x={element.x}
      y={element.y}
      draggable
      onDragEnd={(e) => {
        onDragEnd(element.id, e.target.x(), e.target.y());
      }}
      onClick={() => onClick(element.id)}
    >
      <GaphorIcon
        element={element}
        x={0}
        y={0}
        width={element.width}
        height={element.height}
        isSelected={isSelected}
      />

      <EditableText
        x={textPos.x}
        y={textPos.y}
        width={textPos.width}
        text={element.name}
        fontSize={12}
        fill="#111827"
        backgroundColor="transparent"
        onEditEnd={handleEdit}
        isEditing={element.isEditing && isSelected}
        align="center"
      />
    </Group>
  );
};
