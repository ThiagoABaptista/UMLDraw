import React from "react";
import { Group } from "react-konva";
import Konva from "konva";
import { UseCaseElement } from "../types/umlTypes";
import { ElementIcon } from "./ElementIcon";
import { EditableText } from "./EditableText";

interface UseCaseComponentProps {
  element: UseCaseElement;
  onDragMove?: (id: string, x: number, y: number) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onClick: (id: string) => void;
  onTextEdit: (id: string, value: string) => void;
  isSelected: boolean;
}

export const UseCaseComponent: React.FC<UseCaseComponentProps> = ({
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
      case "actor":
        // ator mantém o texto abaixo
        return { x: 0, y: element.height + 10, width: element.width };
      case "usecase":
        // centraliza dentro da elipse
        return {
          x: 0,
          y: element.height / 2 - 8, // central verticalmente
          width: element.width,
        };
      default:
        return { x: 0, y: element.height / 2 - 8, width: element.width };
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
      <ElementIcon
        element={element}
        x={0}
        y={0}
        width={element.width}
        height={element.height}
        isSelected={isSelected}
      />

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
    </Group>
  );
};
