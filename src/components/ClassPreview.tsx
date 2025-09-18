import React from 'react';
import { Group, Rect, Text, Line } from 'react-konva';

interface ClassPreviewProps {
  x: number;
  y: number;
  visible: boolean;
}

export const ClassPreview: React.FC<ClassPreviewProps> = ({ x, y, visible }) => {
  if (!visible) return null;

  return (
    <Group
      x={x - 100}
      y={y - 60}
      opacity={0.8}
      name="preview-element"
      listening={false}
    >
      <Rect width={200} height={120} fill="#ffffff" stroke="#111827" strokeWidth={1.5} cornerRadius={4} />
      
      {/* Divisórias UML */}
      <Line points={[0, 30, 200, 30]} stroke="#111827" strokeWidth={1} />
      <Line points={[0, 70, 200, 70]} stroke="#111827" strokeWidth={1} />

      {/* Nome da classe */}
      <Text text="NovaClasse" x={10} y={8} fontSize={16} fontStyle="bold" fill="#111827" width={180} />

      {/* Atributos */}
      <Text text="+ atributo: Tipo" x={10} y={40} fontSize={14} fill="#374151" width={180} />

      {/* Métodos */}
      <Text text="+ metodo(): Retorno" x={10} y={80} fontSize={14} fill="#374151" width={180} />
    </Group>
  );
};
