import { renderHook, act } from '@testing-library/react';
import { useExportHandlers } from '../../src/hooks/useExportHandlers';
import { ExportService } from '../../src/services/exportService';

// Mock do ExportService
jest.mock('../../src/services/exportService', () => ({
  ExportService: {
    exportToPNG: jest.fn(),
    exportToPDF: jest.fn(),
  },
}));

describe('useExportHandlers', () => {
  const mockShowMessage = jest.fn();
  const diagram = {
    metadata: { name: 'DiagramaTeste' },
  } as any;

  let mockContainer: HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    mockContainer = document.createElement('div');
    mockContainer.classList.add('konvajs-content');
    document.body.appendChild(mockContainer);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('exporta PNG com sucesso', async () => {
    const { result } = renderHook(() => useExportHandlers(diagram, mockShowMessage));

    await act(async () => {
      await result.current.handleExportPNG();
    });

    expect(ExportService.exportToPNG).toHaveBeenCalledWith(
      mockContainer,
      'DiagramaTeste.png'
    );
    expect(mockShowMessage).toHaveBeenCalledWith(
      'info',
      'Diagrama exportado como PNG com sucesso!'
    );
  });

  it('mostra erro ao exportar PNG se container não existir', async () => {
    document.body.innerHTML = ''; // remove o container

    const { result } = renderHook(() => useExportHandlers(diagram, mockShowMessage));

    await act(async () => {
      await result.current.handleExportPNG();
    });

    expect(mockShowMessage).toHaveBeenCalledWith(
      'error',
      expect.stringContaining('Erro ao exportar PNG')
    );
  });

  it('exporta PDF com sucesso', async () => {
    const { result } = renderHook(() => useExportHandlers(diagram, mockShowMessage));

    await act(async () => {
      await result.current.handleExportPDF();
    });

    expect(ExportService.exportToPDF).toHaveBeenCalledWith(
      mockContainer,
      'DiagramaTeste.pdf',
      undefined
    );
    expect(mockShowMessage).toHaveBeenCalledWith(
      'info',
      'Diagrama exportado como PDF com sucesso!'
    );
  });

  it('mostra erro ao exportar PDF se exportToPDF lançar exceção', async () => {
    (ExportService.exportToPDF as jest.Mock).mockRejectedValueOnce(new Error('Falha'));

    const { result } = renderHook(() => useExportHandlers(diagram, mockShowMessage));

    await act(async () => {
      await result.current.handleExportPDF();
    });

    expect(mockShowMessage).toHaveBeenCalledWith(
      'error',
      expect.stringContaining('Erro ao exportar PDF')
    );
  });
});
