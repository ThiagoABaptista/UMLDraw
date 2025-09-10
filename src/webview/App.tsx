import React, { useState, useCallback, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { UMLClassComponent } from '../components/UMLClass';
import { UMLRelationshipComponent } from '../components/UMLRelationship';
import { Toolbar } from '../components/Toolbar';
import { ClassPreview } from '../components/ClassPreview';
import { 
  UMLClass, UMLRelationship, UMLDiagram, Tool, 
  CreationState, ConnectionState, RelationshipType 
} from '../types/umlTypes';

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
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [connectionStart, setConnectionStart] = useState<string | null>(null);

  // Efeito para controlar o cursor durante modos de criação
  useEffect(() => {
    const stageContainer = document.querySelector('.konvajs-content');
    if (stageContainer) {
      if (creationState === 'placing') {
        stageContainer.classList.add('placing-mode');
      } else if (connectionState !== 'idle') {
        stageContainer.classList.add('connecting-mode');
      } else {
        stageContainer.classList.remove('placing-mode');
        stageContainer.classList.remove('connecting-mode');
      }
    }

    return () => {
      if (stageContainer) {
        stageContainer.classList.remove('placing-mode');
        stageContainer.classList.remove('connecting-mode');
      }
    };
  }, [creationState, connectionState]);

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
      return; // Não permite seleção durante criação de classes
    }

    if (connectionState === 'selecting-first') {
      // Primeiro elemento selecionado para conexão
      setConnectionStart(id);
      setConnectionState('selecting-second');
      setSelectedElement(id);
    } 
    else if (connectionState === 'selecting-second') {
      // Segundo elemento selecionado - cria o relacionamento
      if (connectionStart && connectionStart !== id) {
        const newRelationship: UMLRelationship = {
          id: Date.now().toString(),
          from: connectionStart,
          to: id,
          type: 'association' // Tipo fixo por enquanto
        };

        setDiagram(prev => ({
          ...prev,
          relationships: [...prev.relationships, newRelationship]
        }));
      }
      
      // Reseta o estado de conexão
      setConnectionState('idle');
      setConnectionStart(null);
      setSelectedElement(id);
    } 
    else {
      // Modo de seleção normal
      setSelectedElement(id);
      setIsEditing(false);
    }
  }, [creationState, connectionState, connectionStart]);

  const handleStageClick = useCallback((e: any) => {
    const stage = e.target.getStage();
    
    if (e.target === stage) {
      // Clicou no stage (não em elementos)
      if (creationState === 'placing' && tool === 'class') {
        // Cria nova classe
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
      else if (connectionState !== 'idle') {
        // Clicou no stage durante conexão - cancela
        setConnectionState('idle');
        setConnectionStart(null);
      }
      
      // Limpa estado de edição
      clearEditingState();
    }
  }, [creationState, tool, connectionState]);

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
      // Modo de criação de classes
      setCreationState('placing');
      setConnectionState('idle');
      setConnectionStart(null);
      setTool(newTool);
      setSelectedElement(null);
      setIsEditing(false);
    } 
    else if (newTool === 'relationship') {
      // Modo de criação de relacionamentos
      setCreationState('idle');
      setConnectionState('selecting-first');
      setConnectionStart(null);
      setTool(newTool);
      setSelectedElement(null);
      setIsEditing(false);
    } 
    else {
      // Modo de seleção
      setCreationState('idle');
      setConnectionState('idle');
      setConnectionStart(null);
      setTool(newTool);
    }
  }, []);

  const handleToggleEdit = useCallback(() => {
    if (connectionState !== 'idle') return; // Não permite editar durante conexão
    
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
      clearEditingState();
    }
  }, [isEditing, selectedElement, connectionState]);

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
        connectionState={connectionState}
      />
      
      <Stage 
        width={window.innerWidth} 
        height={window.innerHeight - 50}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          {/* Preview visual durante a colocação de classes */}
          <ClassPreview 
            x={mousePosition.x} 
            y={mousePosition.y} 
            visible={creationState === 'placing' && tool === 'class'} 
          />

          {/* Renderiza relacionamentos */}
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

          {/* Renderiza classes */}
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