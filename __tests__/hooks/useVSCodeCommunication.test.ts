import { renderHook, act } from '@testing-library/react';
import { useVSCodeCommunication } from '../../src/hooks/useVSCodeCommunication';
import { UMLDiagram, UMLProject } from '../../src/types/umlTypes';

describe('useVSCodeCommunication', () => {
  let mockVscode: any;

  const mockDiagram: UMLDiagram = {
    metadata: {
      version: '1.0',
      name: 'Teste',
      created: '2024-01-01T00:00:00Z',
      lastModified: '2024-01-01T00:00:00Z',
      type: 'usecase',
    },
    elements: [],
    relationships: [],
  };

  beforeEach(() => {
    mockVscode = { postMessage: jest.fn() };
    (window as any).vscode = mockVscode;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('envia mensagem de salvar arquivo', () => {
    const { result } = renderHook(() =>
      useVSCodeCommunication(mockDiagram, 'usecase', jest.fn(), () => 'arquivo.uml')
    );

    act(() => {
      result.current.handleSaveToFile();
    });

    expect(mockVscode.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ command: 'saveToFile' })
    );
  });

  it('envia mensagem de salvar projeto', () => {
    const { result } = renderHook(() =>
      useVSCodeCommunication(mockDiagram, 'usecase', jest.fn())
    );

    const mockProject: UMLProject = {
      name: 'ProjetoTeste',
      version: '1.0',
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      diagrams: [mockDiagram],
    };

    act(() => {
      result.current.handleSaveProject(mockProject);
    });

    expect(mockVscode.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ command: 'saveProject' })
    );
  });


  it('recebe mensagem e chama onDataLoaded', () => {
    const onDataLoaded = jest.fn();

    renderHook(() =>
      useVSCodeCommunication(mockDiagram, 'usecase', onDataLoaded)
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { command: 'loadDiagram', diagram: mockDiagram },
        })
      );
    });

    expect(onDataLoaded).toHaveBeenCalledWith(mockDiagram);
  });

  it('remove listener de mensagem no unmount', () => {
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useVSCodeCommunication(mockDiagram, 'usecase', jest.fn())
    );

    expect(addSpy).toHaveBeenCalledWith('message', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('message', expect.any(Function));
  });
});
