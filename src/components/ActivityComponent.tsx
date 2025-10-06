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

  const getTextPosition = () => {
    switch (element.type) {
      case "activity":
        return {
          x: 10,
          y: element.height + 6, // texto fora do ícone
          width: element.width - 20,
          showText: true,
        };
      case "decision":
        return {
          x: 0,
          y: element.height + 6,
          width: element.width,
          showText: false, // geralmente não mostra texto interno
        };
      case "start":
      case "end":
      case "fork":
      case "join":
      case "merge":
        return { x: 0, y: 0, width: 0, showText: false };
      default:
        return {
          x: 0,
          y: element.height + 6,
          width: element.width,
          showText: true,
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

      {textPos.showText && (
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
      )}
    </Group>
  );
};
