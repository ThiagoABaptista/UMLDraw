// __tests__/components/Toolbar.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toolbar } from '../../src/components/Toolbar';

// Mock para ícones do Lucide
jest.mock('lucide-react', () => ({
  User: () => 'UserIcon',
  Square: () => 'SquareIcon',
  Diamond: () => 'DiamondIcon',
  ArrowRight: () => 'ArrowRightIcon',
  Save: () => 'SaveIcon',
  FileDown: () => 'FileDownIcon',
  FolderOpen: () => 'FolderOpenIcon',
  X: () => 'XIcon',
  Image: () => 'ImageIcon',
  GitFork: () => 'GitForkIcon',
  GitMerge: () => 'GitMergeIcon',
  Trash2: () => 'Trash2Icon',
  LayoutPanelLeft: () => 'LayoutPanelLeftIcon',
  PanelRight: () => 'PanelRightIcon',
  FilePlus: () => 'FilePlusIcon',
  ChevronUp: () => 'ChevronUpIcon',
  ChevronDown: () => 'ChevronDownIcon',
  Merge: () => 'MergeIcon',
  Circle: () => 'CircleIcon',
  CircleDot: () => 'CircleDotIcon',
  RectangleHorizontal: () => 'RectangleHorizontalIcon',
}));

describe('Toolbar', () => {
  const defaultProps = {
    tool: 'select' as const,
    onToolChange: jest.fn(),
    onSave: jest.fn(),
    onLoad: jest.fn(),
    onExportPNG: jest.fn(),
    onExportPDF: jest.fn(),
    onDeleteRequested: jest.fn(),
    creationState: 'idle' as const,
    connectionState: 'idle' as const,
    diagramType: 'usecase' as const,
    selectedRelationshipType: 'association' as const,
    onRelationshipTypeChange: jest.fn(),
    onDiagramTypeChange: jest.fn(),
    onToggleSidebar: jest.fn(),
    showSidebar: true,
    onNewDiagram: jest.fn(),
    projectName: 'Test Project',
    onProjectNameChange: jest.fn(),
    selectedElement: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza nome do projeto', () => {
    render(<Toolbar {...defaultProps} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('permite editar nome do projeto com duplo clique', () => {
    render(<Toolbar {...defaultProps} />);
    
    const projectName = screen.getByText('Test Project');
    fireEvent.doubleClick(projectName);
    
    expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument();
  });

  it('renderiza seletor de tipo de diagrama', () => {
    render(<Toolbar {...defaultProps} />);
    
    const diagramSelect = screen.getByTitle('Selecionar tipo de diagrama');
    expect(diagramSelect).toBeInTheDocument();
    expect(diagramSelect).toHaveValue('usecase');
  });

  it('muda tipo de diagrama', () => {
    render(<Toolbar {...defaultProps} />);
    
    const diagramSelect = screen.getByTitle('Selecionar tipo de diagrama');
    fireEvent.change(diagramSelect, {
      target: { value: 'activity' },
    });
    
    expect(defaultProps.onDiagramTypeChange).toHaveBeenCalledWith('activity');
  });

  it('renderiza ferramentas para diagrama de casos de uso', () => {
    render(<Toolbar {...defaultProps} diagramType="usecase" />);
    
    expect(screen.getByTitle('Ator')).toBeInTheDocument();
    expect(screen.getByTitle('Caso de Uso')).toBeInTheDocument();
    expect(screen.getByTitle('Relacionamento')).toBeInTheDocument();
  });

  it('renderiza ferramentas para diagrama de atividades', () => {
    render(<Toolbar {...defaultProps} diagramType="activity" />);
    
    expect(screen.getByTitle('Atividade')).toBeInTheDocument();
    expect(screen.getByTitle('Decisão')).toBeInTheDocument();
    expect(screen.getByTitle('Início')).toBeInTheDocument();
    expect(screen.getByTitle('Fim')).toBeInTheDocument();
  });

  it('muda ferramenta selecionada', () => {
    render(<Toolbar {...defaultProps} />);
    
    fireEvent.click(screen.getByTitle('Ator'));
    
    expect(defaultProps.onToolChange).toHaveBeenCalledWith('actor');
  });

  it('chama ações de arquivo', () => {
    render(<Toolbar {...defaultProps} />);
    
    fireEvent.click(screen.getByTitle('Salvar'));
    expect(defaultProps.onSave).toHaveBeenCalled();
    
    fireEvent.click(screen.getByTitle('Abrir'));
    expect(defaultProps.onLoad).toHaveBeenCalled();
  });

  it('chama ações de exportação', () => {
    render(<Toolbar {...defaultProps} />);
    
    fireEvent.click(screen.getByTitle('Exportar PNG'));
    expect(defaultProps.onExportPNG).toHaveBeenCalled();
    
    fireEvent.click(screen.getByTitle('Exportar PDF'));
    expect(defaultProps.onExportPDF).toHaveBeenCalled();
  });

  it('chama delete quando há elemento selecionado', () => {
    render(<Toolbar {...defaultProps} selectedElement="elem1" />);
    
    fireEvent.click(screen.getByTitle('Excluir elemento selecionado'));
    
    expect(defaultProps.onDeleteRequested).toHaveBeenCalled();
  });

  it('desabilita delete quando não há elemento selecionado', () => {
    render(<Toolbar {...defaultProps} selectedElement={null} />);
    
    const deleteButton = screen.getByTitle('Excluir elemento selecionado');
    
    expect(deleteButton).toBeDisabled();
  });

  it('mostra seletor de relacionamento quando ferramenta é relationship', () => {
    render(<Toolbar {...defaultProps} tool="relationship" />);
    
    const relationshipSelect = screen.getByTitle('Tipo de relacionamento');
    expect(relationshipSelect).toBeInTheDocument();
    expect(relationshipSelect).toHaveValue('association');
  });

  it('muda tipo de relacionamento', () => {
    render(<Toolbar {...defaultProps} tool="relationship" />);
    
    const relationshipSelect = screen.getByTitle('Tipo de relacionamento');
    fireEvent.change(relationshipSelect, {
      target: { value: 'include' },
    });
    
    expect(defaultProps.onRelationshipTypeChange).toHaveBeenCalledWith('include');
  });

  it('mostra botão de cancelar durante criação', () => {
    render(<Toolbar {...defaultProps} creationState="placing" />);
    
    expect(screen.getByTitle('Cancelar operação atual')).toBeInTheDocument();
  });

  it('mostra status durante conexão', () => {
    render(<Toolbar {...defaultProps} connectionState="selecting-first" />);
    
    expect(screen.getByText('Selecione o primeiro elemento...')).toBeInTheDocument();
  });

  it('alterna sidebar', () => {
    render(<Toolbar {...defaultProps} />);
    
    fireEvent.click(screen.getByTitle('Ocultar propriedades'));
    
    expect(defaultProps.onToggleSidebar).toHaveBeenCalled();
  });

  it('recolhe e expande toolbar', () => {
    const { container } = render(<Toolbar {...defaultProps} />);
    
    // Recolhe
    const collapseButton = screen.getByTitle('Recolher Toolbar');
    fireEvent.click(collapseButton);
    
    // Deve mostrar apenas o header recolhido
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('desabilita delete durante criação ou conexão', () => {
    const propsWithCreation = {
      ...defaultProps,
      selectedElement: 'elem1',
      creationState: 'placing' as const,
    };
    
    render(<Toolbar {...propsWithCreation} />);
    
    const deleteButton = screen.getByTitle('Excluir elemento selecionado');
    expect(deleteButton).toBeDisabled();
  });
});