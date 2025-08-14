import React from 'react';
import { Stage, Layer, Rect, Text, Arrow } from 'react-konva';

export default function App() {
  return (
    <Stage width={1000} height={700}>
      <Layer>
        {/* Caixa representando uma classe UML */}
        <Rect x={80} y={80} width={220} height={120} fill="#dbeafe" stroke="#111827" strokeWidth={2} cornerRadius={6} />
        <Text text="ClassePessoa" x={100} y={100} fontSize={18} fontStyle="bold" />
        <Text text="+ nome: string\n+ idade: number" x={100} y={130} fontSize={14} />

        <Rect x={420} y={280} width={240} height={120} fill="#e9d5ff" stroke="#111827" strokeWidth={2} cornerRadius={6} />
        <Text text="ClasseEndereco" x={440} y={300} fontSize={18} fontStyle="bold" />
        <Text text="+ rua: string\n+ cidade: string" x={440} y={330} fontSize={14} />

        {/* Associação entre classes */}
        <Arrow points={[300, 140, 420, 340]} pointerLength={10} pointerWidth={10} stroke="#111827" fill="#111827" />
      </Layer>
    </Stage>
  );
}
