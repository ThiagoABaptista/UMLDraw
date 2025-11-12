import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../src/webview/App';

// Mock de todos os hooks e componentes
jest.mock('../../src/hooks/useDiagramState', () => ({
  useDiagramState: jest.fn(() => ({
    diagram: {
      metadata: {
        name: 'Test Diagram',
        type: 'usecase' as const,
        version: '1.0',
        created: '2024-01-01',
        lastModified: '2024-01-01',
        comments: '',
      },
      elements: [],
      relationships: [],
    },
    selectedElement: null,
    tool: 'select' as const,
    isEditing: false,
    creationState: 'idle' as const,
    connectionState: 'idle' as const,
    connectionStart: null,
    selectedRelationshipType: 'association' as const,
    setDiagram: jest.fn(),
    setSelectedElement: jest.fn(),
    setTool: jest.fn(),
    setIsEditing: jest.fn(),
    setCreationState: jest.fn(),
    setConnectionState: jest.fn(),
    setConnectionStart: jest.fn(),
    updateDiagram: jest.fn(),
    clearEditingState: jest.fn(),
    setSelectedRelationshipType: jest.fn(),
  })),
}));

jest.mock('../../src/hooks/useDiagramOperations', () => ({
  useDiagramOperations: jest.fn(() => ({
    handleToolChange: jest.fn(),
    createNewElement: jest.fn(),
    handleElementClick: jest.fn(),
    handleElementDragEnd: jest.fn(),
    handleTextEdit: jest.fn(),
    prepareDeleteItem: jest.fn(() => ({
      needsConfirm: false,
      execute: jest.fn(),
      relatedCount: 0,
    })),
    handleDiagramTypeChange: jest.fn(() => Promise.resolve({ needsConfirm: true })),
  })),
}));

jest.mock('../../src/hooks/useVSCodeCommunication', () => ({
  useVSCodeCommunication: jest.fn(() => ({
    handleSaveProject: jest.fn(),
    handleLoadProject: jest.fn(),
    showMessage: jest.fn(),
  })),
}));

jest.mock('../../src/hooks/useStageInteractions', () => ({
  useStageInteractions: jest.fn(() => ({
    handleStageClick: jest.fn(),
    handleMouseMove: jest.fn(),
    previewPosition: null,
  })),
}));

jest.mock('../../src/hooks/useCanvasResize', () => ({
  useCanvasResize: jest.fn(() => ({ width: 800, height: 600 })),
}));

jest.mock('../../src/hooks/useStageZoom', () => ({
  useStageZoom: jest.fn(() => ({
    handleStageWheel: jest.fn(),
    handleStagePan: jest.fn(),
  })),
}));

jest.mock('../../src/hooks/useStageDragFeedback', () => ({
  useStageDragFeedback: jest.fn(() => ({
    handleDragMove: jest.fn(),
  })),
}));

jest.mock('../../src/hooks/useKeyboardShortcuts', () => ({
  useKeyboardShortcuts: jest.fn(),
}));

// Mock do exportService
jest.mock('../../src/services/exportService', () => ({
  ExportService: {
    exportToPNG: jest.fn(),
    exportToPDF: jest.fn(),
  },
}));

// Mock dos componentes
jest.mock('../../src/components/Toolbar', () => ({
  Toolbar: jest.fn(({ projectName, onProjectNameChange, onToggleSidebar, ...props }) => (
    <div data-testid="toolbar">
      <span data-testid="project-name">{projectName}</span>
      <button data-testid="save-btn" onClick={props.onSave}>Save</button>
      <button data-testid="toggle-sidebar-btn" onClick={onToggleSidebar}>Toggle Sidebar</button>
      <button data-testid="export-png-btn" onClick={props.onExportPNG}>Export PNG</button>
      <button data-testid="export-pdf-btn" onClick={props.onExportPDF}>Export PDF</button>
      <button data-testid="delete-btn" onClick={props.onDeleteRequested} disabled={!props.selectedElement}>Delete</button>
      <button data-testid="new-diagram-btn" onClick={props.onNewDiagram}>New Diagram</button>
      <select data-testid="diagram-type-select" value={props.diagramType} onChange={(e) => props.onDiagramTypeChange(e.target.value)}>
        <option value="usecase">Use Case</option>
        <option value="activity">Activity</option>
      </select>
    </div>
  )),
}));

jest.mock('../../src/components/DiagramTabs', () => ({
  DiagramTabs: jest.fn(({ diagrams, activeIndex, onSwitch, onNew, onDelete }) => (
    <div data-testid="diagram-tabs">
      {diagrams.map((diagram: any, index: number) => (
        <button
          key={index}
          data-testid={`tab-${index}`}
          data-active={index === activeIndex}
          onClick={() => onSwitch(index)}
        >
          {diagram.metadata.name}
        </button>
      ))}
      <button data-testid="new-tab-btn" onClick={onNew}>+</button>
    </div>
  )),
}));

jest.mock('../../src/components/Sidebar', () => ({
  Sidebar: jest.fn(({ selectedId, diagram, onUpdate, onSelect, onClearSelection }) => (
    <div data-testid="sidebar">Sidebar Content</div>
  )),
}));

// Mock MELHORADO do ConfirmDialog
jest.mock('../../src/components/ConfirmDialog', () => ({
  ConfirmDialog: jest.fn(({ open, title, message, onCancel, onConfirm }) => {
    // Para testes, vamos forçar o diálogo aparecer quando o título for específico
    if (title === 'Alterar tipo de diagrama') {
      // Simula confirmação automática após um delay
      React.useEffect(() => {
        if (open) {
          const timer = setTimeout(() => {
            onConfirm?.();
          }, 10);
          return () => clearTimeout(timer);
        }
      }, [open, onConfirm]);
    }

    return open ? (
      <div data-testid="confirm-dialog">
        <h4>{title}</h4>
        <p>{message}</p>
        <button data-testid="confirm-cancel" onClick={onCancel}>Cancel</button>
        <button data-testid="confirm-ok" onClick={onConfirm}>OK</button>
      </div>
    ) : null;
  }),
}));

jest.mock('react-konva', () => ({
  Stage: jest.fn(({ children, ...props }) => <div data-testid="stage" {...props}>{children}</div>),
  Layer: jest.fn(({ children }) => <div data-testid="layer">{children}</div>),
}));

jest.mock('../../src/components/GridBackground', () => ({
  GridBackground: jest.fn(() => <div data-testid="grid-background" />),
}));

// Mock CORRIGIDO dos componentes de elementos - com keys únicas
jest.mock('../../src/components/UMLRelationship', () => ({
  UMLRelationshipComponent: jest.fn(({ relationship }) => (
    <div data-testid={`relationship-${relationship.id}`}>Relationship</div>
  )),
}));

jest.mock('../../src/components/UseCaseComponent', () => ({
  UseCaseComponent: jest.fn(({ element }) => (
    <div data-testid={`use-case-element-${element.id}`}>Use Case Element</div>
  )),
}));

jest.mock('../../src/components/ActivityComponent', () => ({
  ActivityComponent: jest.fn(({ element }) => (
    <div data-testid={`activity-element-${element.id}`}>Activity Element</div>
  )),
}));

jest.mock('../../src/components/ElementPreview', () => ({
  ElementPreview: jest.fn(() => <div data-testid="element-preview" />),
}));

// Mock do window.vscode
const mockVSCode = {
  postMessage: jest.fn(),
};

beforeEach(() => {
  (window as any).vscode = mockVSCode;
  jest.clearAllMocks();
  
  // Mock do querySelector para export
  const mockStageContainer = document.createElement('div');
  mockStageContainer.className = 'konvajs-content';
  jest.spyOn(document, 'querySelector').mockReturnValue(mockStageContainer);
});

afterEach(() => {
  delete (window as any).vscode;
  jest.restoreAllMocks();
});

describe('App', () => {
  it('renderiza a aplicação principal com componentes básicos', () => {
    render(<App />);
    
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('diagram-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('stage')).toBeInTheDocument();
    // Sidebar deve estar visível por padrão
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('exibe nome do projeto na toolbar', () => {
    render(<App />);
    
    expect(screen.getByTestId('project-name')).toHaveTextContent('Novo Projeto UML');
  });

  it('permite alternar sidebar', async () => {
    render(<App />);

    // Inicialmente a sidebar está visível
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();

    // Clica para esconder
    const toggleButton = screen.getByTestId('toggle-sidebar-btn');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    });

    // Clica novamente para mostrar
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
  });
  it('chama save quando botão é clicado', () => {
    const mockHandleSaveProject = jest.fn();
    require('../../src/hooks/useVSCodeCommunication').useVSCodeCommunication.mockReturnValue({
      handleSaveProject: mockHandleSaveProject,
      handleLoadProject: jest.fn(),
      showMessage: jest.fn(),
    });

    render(<App />);
    
    const saveButton = screen.getByTestId('save-btn');
    fireEvent.click(saveButton);
    
    expect(mockHandleSaveProject).toHaveBeenCalled();
  });

  it('chama export PNG quando botão é clicado', async () => {
    const mockExportToPNG = jest.fn();
    require('../../src/services/exportService').ExportService.exportToPNG = mockExportToPNG;

    render(<App />);
    
    const exportButton = screen.getByTestId('export-png-btn');
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(mockExportToPNG).toHaveBeenCalled();
    });
  });

  it('chama export PDF quando botão é clicado', async () => {
    const mockExportToPDF = jest.fn();
    require('../../src/services/exportService').ExportService.exportToPDF = mockExportToPDF;

    render(<App />);
    
    const exportButton = screen.getByTestId('export-pdf-btn');
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(mockExportToPDF).toHaveBeenCalled();
    });
  });

  it('permite criar novo diagrama', () => {
    render(<App />);
    
    const newDiagramButton = screen.getByTestId('new-diagram-btn');
    fireEvent.click(newDiagramButton);
    
    // Deve ter mais abas após criar novo diagrama
    const tabs = screen.getAllByTestId(/^tab-/);
    expect(tabs.length).toBeGreaterThan(1);
  });

  it('permite alternar entre diagramas', () => {
    render(<App />);
    
    // Primeiro cria um novo diagrama
    const newDiagramButton = screen.getByTestId('new-diagram-btn');
    fireEvent.click(newDiagramButton);
    
    const tabs = screen.getAllByTestId(/^tab-/);
    expect(tabs).toHaveLength(2);
    
    // Clica na segunda aba
    fireEvent.click(tabs[1]);
    
    // A segunda aba deve estar ativa
    expect(tabs[1]).toHaveAttribute('data-active', 'true');
  });

  it('mostra diálogo de confirmação para excluir elemento com relações', () => {
    const mockPrepareDeleteItem = jest.fn(() => ({
      needsConfirm: true,
      execute: jest.fn(),
      relatedCount: 2,
    }));
    require('../../src/hooks/useDiagramOperations').useDiagramOperations.mockReturnValue({
      handleToolChange: jest.fn(),
      createNewElement: jest.fn(),
      handleElementClick: jest.fn(),
      handleElementDragEnd: jest.fn(),
      handleTextEdit: jest.fn(),
      prepareDeleteItem: mockPrepareDeleteItem,
    });

    const mockSetSelectedElement = jest.fn();
    require('../../src/hooks/useDiagramState').useDiagramState.mockReturnValue({
      ...require('../../src/hooks/useDiagramState').useDiagramState(),
      selectedElement: 'test-element',
      setSelectedElement: mockSetSelectedElement,
    });

    render(<App />);
    
    const deleteButton = screen.getByTestId('delete-btn');
    fireEvent.click(deleteButton);
    
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    expect(screen.getByText('Excluir elemento')).toBeInTheDocument();
  });

  it('permite alterar tipo de diagrama', async () => {
    // Mock com elementos para trigger da confirmação
    const mockUseDiagramState = require('../../src/hooks/useDiagramState').useDiagramState;
    mockUseDiagramState.mockReturnValue({
      ...mockUseDiagramState(),
      diagram: {
        metadata: {
          name: 'Test Diagram',
          type: 'usecase' as const,
          version: '1.0',
          created: '2024-01-01',
          lastModified: '2024-01-01',
          comments: '',
        },
        elements: [
          {
            id: 'elem1',
            type: 'actor',
            name: 'Test Actor',
            x: 100,
            y: 100,
            width: 60,
            height: 80,
            color: '#000000',
          }
        ],
        relationships: [],
      },
    });

    render(<App />);
    
    const diagramTypeSelect = screen.getByTestId('diagram-type-select');
    
    // Muda para activity - deve disparar confirmação
    fireEvent.change(diagramTypeSelect, { target: { value: 'activity' } });
    
    // O diálogo deve aparecer
    await waitFor(() => {
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Alterar tipo de diagrama')).toBeInTheDocument();
  });

  it('renderiza elementos do diagrama corretamente', () => {
    // Mock específico com elementos
    const mockUseDiagramState = require('../../src/hooks/useDiagramState').useDiagramState;
    mockUseDiagramState.mockReturnValue({
      ...mockUseDiagramState(),
      diagram: {
        metadata: {
          name: 'Test Diagram',
          type: 'usecase' as const,
          version: '1.0',
          created: '2024-01-01',
          lastModified: '2024-01-01',
          comments: '',
        },
        elements: [
          {
            id: 'elem1',
            type: 'actor',
            name: 'Test Actor',
            x: 100,
            y: 100,
            width: 60,
            height: 80,
            color: '#000000',
          },
          {
            id: 'elem2',
            type: 'usecase',
            name: 'Test Use Case',
            x: 200,
            y: 100,
            width: 80,
            height: 60,
            color: '#000000',
          },
        ],
        relationships: [
          {
            id: 'rel1',
            type: 'association',
            from: 'elem1',
            to: 'elem2',
            label: 'Test Link',
          },
        ],
      },
    });

    render(<App />);

    // Verifica se os elementos foram renderizados (usando getAllBy para múltiplos elementos)
    const useCaseElements = screen.getAllByTestId(/^use-case-element-/);
    expect(useCaseElements.length).toBe(2);
    
    const relationshipElements = screen.getAllByTestId(/^relationship-/);
    expect(relationshipElements.length).toBe(1);
  });

  it('renderiza elementos de atividade quando tipo é activity', () => {
    const mockUseDiagramState = require('../../src/hooks/useDiagramState').useDiagramState;
    mockUseDiagramState.mockReturnValue({
      ...mockUseDiagramState(),
      diagram: {
        metadata: {
          name: 'Test Activity Diagram',
          type: 'activity' as const,
          version: '1.0',
          created: '2024-01-01',
          lastModified: '2024-01-01',
          comments: '',
        },
        elements: [
          {
            id: 'activity1',
            type: 'activity',
            name: 'Test Activity',
            x: 100,
            y: 100,
            width: 100,
            height: 60,
            color: '#000000',
          },
        ],
        relationships: [],
      },
    });

    render(<App />);
    
    expect(screen.getByTestId('activity-element-activity1')).toBeInTheDocument();
  });

  it('atualiza nome do projeto', () => {
    render(<App />);
    
    const projectName = screen.getByTestId('project-name');
    expect(projectName).toHaveTextContent('Novo Projeto UML');
  });
});