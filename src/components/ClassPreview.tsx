import React from 'react';
import { Group, Rect, Text } from 'react-konva';

interface ClassPreviewProps {
  x: number;
  y: number;
  visible: boolean;
}

export const ClassPreview: React.FC<ClassPreviewProps> = ({ x, y, visible }) => {
  if (!visible) return null;

  return (
    <Group
      x={x - 100} // Centraliza no cursor
      y={y - 60}
      opacity={0.7}
      name="preview-element" // Nome para identificar que é um preview
      listening={false} // Isto é IMPORTANTE: faz o preview ignorar eventos de mouse
    >
      <Rect
        width={200}
        height={120}
        fill="#dbeafe"
        stroke="#3b82f6"
        strokeWidth={2}
        cornerRadius={6}
        dash={[5, 5]}
        listening={false} // Também desativa eventos nos elementos filhos
      />
      
      <Rect
        width={200}
        height={30}
        fill="#3b82f6"
        cornerRadius={[6, 6, 0, 0]}
        opacity={0.7}
        listening={false}
      />
      
      <Text
        text="NovaClasse"
        x={10}
        y={5}
        fontSize={16}
        fontStyle="bold"
        fill="white"
        width={180}
        listening={false}
      />
      
      <Text
        text="+ atributo: tipo"
        x={10}
        y={40}
        fontSize={14}
        fill="#374151"
        width={180}
        listening={false}
      />
      
      <Text
        text="+ metodo(): retorno"
        x={10}
        y={60}
        fontSize={14}
        fill="#374151"
        width={180}
        listening={false}
      />
    </Group>
  );
};