/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from '../../src/components/ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    message: 'Tem certeza que deseja excluir este item?',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não renderiza quando open é false', () => {
    const { container } = render(<ConfirmDialog {...defaultProps} open={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza com valores padrão quando open é true', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    expect(screen.getByText('Confirmação')).toBeInTheDocument();
    expect(screen.getByText('Tem certeza que deseja excluir este item?')).toBeInTheDocument();
    expect(screen.getByText('Sim')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('renderiza com props customizadas', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        title="Excluir Diagrama"
        confirmLabel="Excluir"
        cancelLabel="Manter"
      />
    );
    
    expect(screen.getByText('Excluir Diagrama')).toBeInTheDocument();
    expect(screen.getByText('Excluir')).toBeInTheDocument();
    expect(screen.getByText('Manter')).toBeInTheDocument();
  });

  it('chama onConfirm quando o botão de confirmação é clicado', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    const confirmButton = screen.getByText('Sim');
    fireEvent.click(confirmButton);
    
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('chama onCancel quando o botão de cancelar é clicado', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('aplica estilos corretamente', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    const dialog = screen.getByText('Confirmação').closest('div');
    
    // Verifica se o elemento existe
    expect(dialog).toBeInTheDocument();
    
    // Verifica se o overlay está presente (alternativa para verificar estilos)
    const overlay = document.querySelector('[style*="position: fixed"]');
    expect(overlay).toBeInTheDocument();
  });
});