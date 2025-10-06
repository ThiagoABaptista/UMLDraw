import { useState, useCallback } from 'react';
import { UMLDiagram, Tool, CreationState, ConnectionState, UseCaseElement, ActivityElement, UMLRelationship } from '../types/umlTypes';

const initialDiagram: UMLDiagram = {
    metadata: {
        version: '1.0',
        name: 'Novo Diagrama de Caso de Uso',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        type: 'usecase'
    },
    elements: [
        {
            id: '1',
            type: 'actor',
            name: 'Usuário',
            x: 100,
            y: 100,
            width: 60,
            height: 100
        },
        {
            id: '2',
            type: 'usecase',
            name: 'Realizar Login',
            x: 300,
            y: 120,
            width: 100,
            height: 40
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

export const useDiagramState = () => {
    const [diagram, setDiagram] = useState<UMLDiagram>(initialDiagram);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [tool, setTool] = useState<Tool>('select');
    const [isEditing, setIsEditing] = useState(false);
    const [creationState, setCreationState] = useState<CreationState>('idle');
    const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
    const [connectionStart, setConnectionStart] = useState<string | null>(null);

    const updateDiagram = useCallback((updater: (prev: UMLDiagram) => UMLDiagram) => {
        setDiagram(updater);
    }, []);

    const clearEditingState = useCallback(() => {
        setDiagram(prev => ({
            ...prev,
            elements: prev.elements.map(element => ({
            ...element,
            isEditing: false
            }))
        }));
        setIsEditing(false);
    }, []);

    return {
        diagram,
        selectedElement,
        tool,
        isEditing,
        creationState,
        connectionState,
        connectionStart,
        setDiagram,
        setSelectedElement,
        setTool,
        setIsEditing,
        setCreationState: setCreationState as (state: CreationState) => void,
        setConnectionState: setConnectionState as (state: ConnectionState) => void,
        setConnectionStart,
        updateDiagram,
        clearEditingState
    };
};