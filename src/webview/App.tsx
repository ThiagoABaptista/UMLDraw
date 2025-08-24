import React, { useState, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import { UMLClassComponent } from '../components/UMLClass';
import { UMLRelationshipComponent } from '../components/UMLRelationship';
import { Toolbar } from '../components/Toolbar';
import { UMLClass, UMLRelationship, UMLDiagram } from '../types/umlTypes';

const initialDiagram: UMLDiagram = {
  classes: [
    {
      id: '1',
      name: 'Pessoa',
      attributes: ['+ nome: string', '+ idade: number'],
      methods: ['+ falar(): void'],
      x: 100,
      y: 100,
      width: 200,
      height: 120
    },
    {
      id: '2',
      name: 'Endereço',
      attributes: ['+ rua: string', '+ cidade: string'],
      methods: [],
      x: 400,
      y: 300,
      width: 200,
      height: 100
    }
  ],
  relationships: [
    {
      id: 'rel1',
      from: '1',
      to: '2',
      type: 'association'
    }
  ]
};

export default function App() {
  const [diagram, setDiagram] = useState<UMLDiagram>(initialDiagram);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'class' | 'relationship'>('select');

  const handleClassDragEnd = useCallback((id: string, x: number, y: number) => {
    setDiagram(prev => ({
      ...prev,
      classes: prev.classes.map(cls =>
        cls.id === id ? { ...cls, x, y } : cls
      )
    }));
  }, []);

  const handleElementClick = useCallback((id: string) => {
    setSelectedElement(id);
  }, []);

  const getClassCenter = (umlClass: UMLClass) => ({
    x: umlClass.x + umlClass.width / 2,
    y: umlClass.y + umlClass.height / 2
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Toolbar tool={tool} onToolChange={setTool} />
      
      <Stage width={window.innerWidth} height={window.innerHeight - 50}>
        <Layer>
          {diagram.relationships.map(rel => {
            const fromClass = diagram.classes.find(c => c.id === rel.from);
            const toClass = diagram.classes.find(c => c.id === rel.to);
            
            if (!fromClass || !toClass) return null;

            return (
              <UMLRelationshipComponent
                key={rel.id}
                relationship={rel}
                from={getClassCenter(fromClass)}
                to={getClassCenter(toClass)}
                isSelected={selectedElement === rel.id}
                onClick={handleElementClick}
              />
            );
          })}

          {diagram.classes.map(umlClass => (
            <UMLClassComponent
              key={umlClass.id}
              umlClass={umlClass}
              onDragEnd={handleClassDragEnd}
              onClick={handleElementClick}
              isSelected={selectedElement === umlClass.id}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}