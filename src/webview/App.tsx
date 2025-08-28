import React, { useState, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import { UMLClassComponent } from '../components/UMLClass';
import { UMLRelationshipComponent } from '../components/UMLRelationship';
import { Toolbar } from '../components/Toolbar';
import { UMLClass, UMLRelationship, UMLDiagram, Tool } from '../types/umlTypes';

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
  const [tool, setTool] = useState<Tool>('select');
  const [isEditing, setIsEditing] = useState(false);

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
    setIsEditing(false);
  }, []);

  const handleTextEdit = useCallback((id: string, field: 'name' | 'attributes' | 'methods', value: string) => {
    setDiagram(prev => ({
      ...prev,
      classes: prev.classes.map(cls => {
        if (cls.id === id) {
          if (field === 'name') {
            return { ...cls, name: value };
          } else if (field === 'attributes') {
            return { ...cls, attributes: value.split('\n').filter(line => line.trim()) };
          } else if (field === 'methods') {
            return { ...cls, methods: value.split('\n').filter(line => line.trim()) };
          }
        }
        return cls;
      })
    }));
    setIsEditing(false);
  }, []);

  const handleAddClass = useCallback(() => {
    const newClass: UMLClass = {
      id: Date.now().toString(),
      name: 'NovaClasse',
      attributes: ['+ atributo: tipo'],
      methods: ['+ metodo(): retorno'],
      x: 100,
      y: 100,
      width: 200,
      height: 120
    };

    setDiagram(prev => ({
      ...prev,
      classes: [...prev.classes, newClass]
    }));
    setSelectedElement(newClass.id);
  }, []);

  const handleToggleEdit = useCallback(() => {
    setIsEditing(prev => !prev);
    if (!isEditing && selectedElement) {
      setDiagram(prev => ({
        ...prev,
        classes: prev.classes.map(cls => ({
          ...cls,
          isEditing: cls.id === selectedElement
        }))
      }));
    }
  }, [isEditing, selectedElement]);

  const getClassCenter = (umlClass: UMLClass) => ({
    x: umlClass.x + umlClass.width / 2,
    y: umlClass.y + umlClass.height / 2
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Toolbar
        tool={tool}
        onToolChange={setTool}
        onAddClass={handleAddClass}
        onToggleEdit={handleToggleEdit}
        isEditing={isEditing}
        selectedElement={selectedElement}
      />
      
      <Stage 
        width={window.innerWidth} 
        height={window.innerHeight - 50}
        onClick={(e) => {
          if (e.target === e.target.getStage()) {
            setSelectedElement(null);
            setIsEditing(false);
          }
        }}
      >
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
              onTextEdit={handleTextEdit}
              isSelected={selectedElement === umlClass.id}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}