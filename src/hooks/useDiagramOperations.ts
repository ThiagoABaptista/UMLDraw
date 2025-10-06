import { useCallback } from 'react';
import { UseCaseElement, ActivityElement, UMLRelationship, Tool, UMLDiagram, CreationState, ConnectionState, RelationshipType } from '../types/umlTypes';
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
    props: DiagramOperationsProps,
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
        setSelectedElement,
        setTool,
        setIsEditing,
        setCreationState,
        setConnectionState,
        setConnectionStart,
        updateDiagram,
        clearEditingState
    } = props;

    const createNewRelationship = useCallback((from: string, to: string): UMLRelationship => {
        // Determina o tipo de relacionamento baseado no tipo de diagrama
        let relationshipType: RelationshipType;
        
        if (diagramType === 'activity') {
            relationshipType = 'control_flow';
        } else {
            relationshipType = 'association';
        }

        return {
            id: Date.now().toString(),
            from,
            to,
            type: relationshipType,
            label: getDefaultRelationshipLabel(relationshipType)
        };
    }, [diagramType]);

    const handleElementDragEnd = useCallback((id: string, x: number, y: number) => {
        updateDiagram((prev: UMLDiagram) => ({
            ...prev,
            elements: prev.elements.map((element: UseCaseElement | ActivityElement) =>
                element.id === id ? { ...element, x, y } : element
            )
        }));
    }, [updateDiagram]);

    const handleElementClick = useCallback((id: string) => {
        // Se está no meio de uma colocação, ignorar o clique (deve clicar no stage para colocar)
        if (creationState === 'placing') {
            return;
        }

        // Lógica de conexão
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
        } else {
            // Seleção normal de elemento
            setSelectedElement(id);
            setIsEditing(false);
        }
    }, [creationState, connectionState, connectionStart, setConnectionStart, setConnectionState, setSelectedElement, setIsEditing, updateDiagram, createNewRelationship]);

    const handleStageClick = useCallback(() => {
        // Click no stage vazio - desselecionar elemento atual
        setSelectedElement(null);
        setIsEditing(false);
        
        // Se estava no meio de uma colocação, criar o elemento
        if (creationState === 'placing') {
            setCreationState('idle');
        }
        
        // Se estava no meio de uma conexão, cancelar
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
        // Cancela qualquer operação em andamento
        setCreationState('idle');
        setConnectionState('idle');
        setConnectionStart(null);
        
        // Muda para a nova ferramenta
        setTool(newTool);
        setSelectedElement(null);
        setIsEditing(false);
        
        // Se é uma ferramenta de elemento (não relationship), entra em modo de colocação
        if (newTool !== 'relationship') {
            setCreationState('placing');
        } else {
            // Se é relationship, entra em modo de conexão
            setConnectionState('selecting-first');
        }
    }, [setCreationState, setConnectionState, setConnectionStart, setTool, setSelectedElement, setIsEditing]);

    const handleToggleEdit = useCallback(() => {
        // Só permite editar se não há operações em andamento e há um elemento selecionado
        const hasActiveOperation = connectionState !== 'idle' || creationState === 'placing';
        
        if (hasActiveOperation || !selectedElement) return;
        
        setIsEditing(!isEditing);
        
        if (!isEditing) {
            // Entrando no modo edição
            updateDiagram((prev: UMLDiagram) => ({
                ...prev,
                elements: prev.elements.map((element: UseCaseElement | ActivityElement) => ({
                    ...element,
                    isEditing: element.id === selectedElement
                }))
            }));
        } else {
            // Saindo do modo edição
            clearEditingState();
        }
    }, [connectionState, creationState, isEditing, selectedElement, setIsEditing, updateDiagram, clearEditingState]);

    const createNewElement = useCallback(
        (tool: Tool, x: number, y: number): UseCaseElement | ActivityElement => {
            const defaults = getElementDefaults(tool);

            const baseElement = {
            id: uuidv4(),
            name: getDefaultName(tool),
            x: x - defaults.width / 2,
            y: y - defaults.height / 2,
            width: defaults.width,
            height: defaults.height,
            isEditing: false,
            };

            return {
            ...baseElement,
            type: tool as UseCaseElement["type"] | ActivityElement["type"],
            } as UseCaseElement | ActivityElement;
        },
        [diagramType]
        );

    // Funções auxiliares
    const getDefaultName = (tool: Tool): string => {
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
        return names[tool] || 'Elemento';
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

    const getActivityElementWidth = (tool: Tool): number => {
        const widths: Record<string, number> = {
            activity: 80,
            decision: 60,
            start: 40,
            end: 40,
            fork: 25,
            join: 25,
            merge: 60
        };
        return widths[tool] || 60;
    };

    const getActivityElementHeight = (tool: Tool): number => {
        const heights: Record<string, number> = {
            activity: 50,
            decision: 60,
            start: 40,
            end: 40,
            fork: 80,
            join: 80,
            merge: 60
        };
        return heights[tool] || 50;
    };

    return {
        handleElementDragEnd,
        handleElementClick,
        handleStageClick,
        handleTextEdit,
        handleToolChange,
        handleToggleEdit,
        createNewElement,
        createNewRelationship
    };
};