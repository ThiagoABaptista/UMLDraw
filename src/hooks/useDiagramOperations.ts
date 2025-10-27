import { useCallback } from 'react';
import {
  UseCaseElement,
  ActivityElement,
  UMLRelationship,
  Tool,
  UMLDiagram,
  CreationState,
  ConnectionState,
  RelationshipType
} from '../types/umlTypes';
import { getElementDefaults } from "../utils/diagramDefaults";
import { v4 as uuidv4 } from "uuid";

interface DiagramOperationsProps {
  diagram: UMLDiagram;
  selectedElement: string | null;
  tool: Tool;
  isEditing: boolean;
  creationState: CreationState;
  connectionState: ConnectionState;
  connectionStart: string | null;
  setDiagram: (diagram: UMLDiagram) => void;
  setSelectedElement: (id: string | null) => void;
  setTool: (tool: Tool) => void;
  setIsEditing: (editing: boolean) => void;
  setCreationState: (state: CreationState) => void;
  setConnectionState: (state: ConnectionState) => void;
  setConnectionStart: (id: string | null) => void;
  updateDiagram: (updater: (prev: UMLDiagram) => UMLDiagram) => void;
  clearEditingState: () => void;
}

export const useDiagramOperations = (
  props: DiagramOperationsProps & {
    selectedRelationshipType?: RelationshipType;
  },
  diagramType: 'usecase' | 'activity'
) => {
  const {
    diagram,
    selectedElement,
    tool,
    isEditing,
    creationState,
    connectionState,
    connectionStart,
    selectedRelationshipType = 'association',
    setSelectedElement,
    setTool,
    setIsEditing,
    setCreationState,
    setConnectionState,
    setConnectionStart,
    updateDiagram,
    clearEditingState
  } = props;

  // cria relacionamento padrão dependendo do tipo de diagrama
  const createNewRelationship = useCallback((from: string, to: string): UMLRelationship => {
    const relationshipType = selectedRelationshipType;
    return {
      id: Date.now().toString(),
      from,
      to,
      type: relationshipType,
      label: getDefaultRelationshipLabel(relationshipType)
    };
  }, [selectedRelationshipType]);

  const handleElementDragEnd = useCallback((id: string, x: number, y: number) => {
    updateDiagram((prev: UMLDiagram) => ({
      ...prev,
      elements: prev.elements.map((element: UseCaseElement | ActivityElement) =>
        element.id === id ? { ...element, x, y } : element
      )
    }));
  }, [updateDiagram]);

  const handleElementClick = useCallback((id: string) => {
    // Se está no meio de uma colocação, ignorar o clique (colocação deve usar click no stage)
    if (creationState === 'placing') return;

    if (connectionState === 'selecting-first') {
      setConnectionStart(id);
      setConnectionState('selecting-second');
      setSelectedElement(id);
    } else if (connectionState === 'selecting-second') {
      if (connectionStart && connectionStart !== id) {
        const newRelationship = createNewRelationship(connectionStart, id);
        updateDiagram((prev: UMLDiagram) => ({
          ...prev,
          relationships: [...prev.relationships, newRelationship]
        }));
      }
      setConnectionState('idle');
      setConnectionStart(null);
      setSelectedElement(id);
      setTool('select');
    } else {
      setSelectedElement(id);
      setIsEditing(false);
    }
  }, [creationState, connectionState, connectionStart, setConnectionStart, setConnectionState, setSelectedElement, setIsEditing, updateDiagram, createNewRelationship]);

  const handleStageClick = useCallback(() => {
    setSelectedElement(null);
    setIsEditing(false);

    if (creationState === 'placing') {
      setCreationState('idle');
    }

    if (connectionState !== 'idle') {
      setConnectionState('idle');
      setConnectionStart(null);
    }
  }, [creationState, connectionState, setSelectedElement, setIsEditing, setCreationState, setConnectionState, setConnectionStart]);

  const handleTextEdit = useCallback((id: string, value: string) => {
    updateDiagram((prev: UMLDiagram) => ({
      ...prev,
      elements: prev.elements.map((element: UseCaseElement | ActivityElement) =>
        element.id === id ? { ...element, name: value } : element
      )
    }));
    setIsEditing(false);
  }, [updateDiagram, setIsEditing]);

  const handleToolChange = useCallback((newTool: Tool) => {
    // cancela operações em andamento
    setCreationState('idle');
    setConnectionState('idle');
    setConnectionStart(null);

    setTool(newTool);
    setSelectedElement(null);
    setIsEditing(false);

    // se é ferramenta de elemento (não 'relationship') entra em placing
    if (newTool !== 'relationship') {
      setCreationState('placing');
    } else {
      setConnectionState('selecting-first');
    }
  }, [setCreationState, setConnectionState, setConnectionStart, setTool, setSelectedElement, setIsEditing]);

  const createNewElement = useCallback(
    (toolParam: Tool, x: number, y: number): UseCaseElement | ActivityElement => {
      const defaults = getElementDefaults(toolParam);

      const baseElement = {
        id: uuidv4(),
        name: getDefaultName(toolParam),
        x: x - defaults.width / 2,
        y: y - defaults.height / 2,
        width: defaults.width,
        height: defaults.height,
        isEditing: false,
        color: '#000000'
      };

      return {
        ...baseElement,
        type: toolParam as UseCaseElement["type"] | ActivityElement["type"]
      } as UseCaseElement | ActivityElement;
    },
    [diagramType]
  );

  // --- DELEÇÃO UNIFICADA ---
  const prepareDeleteItem = useCallback((id: string) => {
    const isElement = diagram.elements.some(e => e.id === id);
    const isRelationship = diagram.relationships.some(r => r.id === id);

    if (isRelationship) {
      // deletar relação diretamente
      const execute = () => {
        updateDiagram(prev => ({
          ...prev,
          relationships: prev.relationships.filter(r => r.id !== id),
        }));
        if (selectedElement === id) setSelectedElement(null);
      };

      return { needsConfirm: false, relatedCount: 0, execute };
    }

    if (isElement) {
      const rels = diagram.relationships.filter(r => r.from === id || r.to === id);
      const needsConfirm = rels.length > 0;

      const execute = () => {
        updateDiagram(prev => ({
          ...prev,
          elements: prev.elements.filter(e => e.id !== id),
          relationships: prev.relationships.filter(r => r.from !== id && r.to !== id)
        }));
        if (selectedElement === id) setSelectedElement(null);
      };

      return { needsConfirm, relatedCount: rels.length, execute };
    }

    // fallback — nada encontrado
    return { needsConfirm: false, relatedCount: 0, execute: () => {} };
  }, [diagram, updateDiagram, selectedElement, setSelectedElement]);


  // helpers
  const getDefaultName = (toolParam: Tool): string => {
    const names: Record<string, string> = {
      actor: 'Ator',
      usecase: 'Caso de Uso',
      activity: 'Atividade',
      decision: 'Decisão',
      start: 'Início',
      end: 'Fim',
      fork: 'Fork',
      join: 'Join',
      merge: 'Merge'
    };
    return names[toolParam] || 'Elemento';
  };

  const getDefaultRelationshipLabel = (type: RelationshipType): string => {
    const labels: Record<RelationshipType, string> = {
      association: '',
      include: '<<include>>',
      extend: '<<extend>>',
      generalization: '',
      dependency: '<<use>>',
      control_flow: '',
      object_flow: '<<object>>'
    };
    return labels[type];
  };

  return {
    handleElementDragEnd,
    handleElementClick,
    handleStageClick,
    handleTextEdit,
    handleToolChange,
    createNewElement,
    createNewRelationship,
    prepareDeleteItem
  };
};
