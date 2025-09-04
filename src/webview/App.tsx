import React, { useState, useCallback, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { UMLClassComponent } from '../components/UMLClass';
import { UMLRelationshipComponent } from '../components/UMLRelationship';
import { Toolbar } from '../components/Toolbar';
import { UMLClass, UMLRelationship, UMLDiagram, Tool, CreationState } from '../types/umlTypes';
import { ClassPreview } from '../components/ClassPreview';

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
  const [creationState, setCreationState] = useState<CreationState>('idle');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Efeito para controlar o cursor durante o modo de colocação
  useEffect(() => {
    const stageContainer = document.querySelector('.konvajs-content');
    if (stageContainer) {
      if (creationState === 'placing') {
        stageContainer.classList.add('placing-mode');
      } else {
        stageContainer.classList.remove('placing-mode');
      }
    }

    // Cleanup function
    return () => {
      if (stageContainer) {
        stageContainer.classList.remove('placing-mode');
      }
    };
  }, [creationState]);

  const handleClassDragEnd = useCallback((id: string, x: number, y: number) => {
    setDiagram(prev => ({
      ...prev,
      classes: prev.classes.map((cls: UMLClass) =>
        cls.id === id ? { ...cls, x, y } : cls
      )
    }));
  }, []);

  const handleElementClick = useCallback((id: string) => {
    if (creationState === 'placing') {
      // Não permite selecionar elementos durante a criação
      return;
    }
    setSelectedElement(id);
    setIsEditing(false);
  }, [creationState]);
  
  const clearEditingState = useCallback(() => {
    setDiagram(prev => ({
      ...prev,
      classes: prev.classes.map(cls => ({
        ...cls,
        isEditing: false
      }))
    }));
    setIsEditing(false);
  }, []);

 const handleStageClick = useCallback((e: any) => {
  const stage = e.target.getStage();
  
  // Limpa o estado de edição ao clicar fora de qualquer elemento
  if (e.target === stage) {
    clearEditingState();
  }
  
  // Só processa cliques no stage (não em elementos) para criação
  if (e.target === stage && creationState === 'placing' && tool === 'class') {
    // Cria uma nova classe na posição clicada
    const pos = stage.getPointerPosition();
    
    const newClass: UMLClass = {
      id: Date.now().toString(),
      name: 'NovaClasse',
      attributes: ['+ atributo: tipo'],
      methods: ['+ metodo(): retorno'],
      x: pos.x - 100,
      y: pos.y - 60,
      width: 200,
      height: 120
    };

    setDiagram(prev => ({
      ...prev,
      classes: [...prev.classes, newClass]
    }));
    
    setSelectedElement(newClass.id);
    setCreationState('idle');
    setTool('select');
  }
}, [creationState, tool, clearEditingState]);

  const handleMouseMove = useCallback((e: any) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setMousePosition(pos);
  }, []);

  const handleTextEdit = useCallback((id: string, field: 'name' | 'attributes' | 'methods', value: string) => {
    setDiagram(prev => ({
      ...prev,
      classes: prev.classes.map((cls: UMLClass) => {
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

  const handleToolChange = useCallback((newTool: Tool) => {
    if (newTool === 'class') {
      // Entra no modo de colocação para classes
      setCreationState('placing');
      setTool(newTool);
      setSelectedElement(null);
      setIsEditing(false);
    } else {
      // Para outras ferramentas, volta ao modo normal
      setCreationState('idle');
      setTool(newTool);
    }
  }, []);

  const handleToggleEdit = useCallback(() => {
    setIsEditing(prev => !prev);
    if (!isEditing && selectedElement) {
      setDiagram(prev => ({
        ...prev,
        classes: prev.classes.map((cls: UMLClass) => ({
          ...cls,
          isEditing: cls.id === selectedElement
        }))
      }));
    } else {
      setDiagram(prev => ({
        ...prev,
        classes: prev.classes.map((cls: UMLClass) => ({
          ...cls,
          isEditing: false
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
        onToolChange={handleToolChange}
        onToggleEdit={handleToggleEdit}
        isEditing={isEditing}
        selectedElement={selectedElement}
        creationState={creationState}
      />
      
      <Stage 
        width={window.innerWidth} 
        height={window.innerHeight - 50}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          {/* Preview visual durante a colocação - deve ser o ÚLTIMO elemento */}
          <ClassPreview 
            x={mousePosition.x} 
            y={mousePosition.y} 
            visible={creationState === 'placing' && tool === 'class'} 
          />

          {diagram.relationships.map((rel: UMLRelationship) => {
            const fromClass = diagram.classes.find((c: UMLClass) => c.id === rel.from);
            const toClass = diagram.classes.find((c: UMLClass) => c.id === rel.to);
            
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

          {diagram.classes.map((umlClass: UMLClass) => (
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