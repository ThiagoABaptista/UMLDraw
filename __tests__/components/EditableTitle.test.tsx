/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditableTitle } from '../../src/components/EditableTitle';

// Mock para simular a mudança de estado
describe('EditableTitle', () => {
  const defaultProps = {
    value: 'Título Inicial',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza título inicial corretamente', () => {
    render(<EditableTitle {...defaultProps} />);
    
    expect(screen.getByText('Título Inicial')).toBeInTheDocument();
    expect(screen.getByText('Título Inicial')).toHaveClass('toolbar-project-name');
  });

  it('entra em modo edição ao dar double click', () => {
    render(<EditableTitle {...defaultProps} />);
    
    fireEvent.doubleClick(screen.getByText('Título Inicial'));
    
    expect(screen.getByDisplayValue('Título Inicial')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Título Inicial')).toHaveClass('editable-title-input');
  });

  it('salva alterações ao pressionar Enter', () => {
    const onChange = jest.fn();
    const { rerender } = render(<EditableTitle value="Título Inicial" onChange={onChange} />);
    
    // Entra no modo edição
    fireEvent.doubleClick(screen.getByText('Título Inicial'));
    
    const input = screen.getByDisplayValue('Título Inicial');
    fireEvent.change(input, { target: { value: 'Novo Título' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(onChange).toHaveBeenCalledWith('Novo Título');
    
    // Re-renderiza com o novo valor
    rerender(<EditableTitle value="Novo Título" onChange={onChange} />);
    
    expect(screen.getByText('Novo Título')).toBeInTheDocument();
  });

  it('cancela edição ao pressionar Escape', () => {
    render(<EditableTitle {...defaultProps} />);
    
    // Entra no modo edição
    fireEvent.doubleClick(screen.getByText('Título Inicial'));
    
    const input = screen.getByDisplayValue('Título Inicial');
    fireEvent.change(input, { target: { value: 'Título Alterado' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    
    // Deve reverter para o valor original
    expect(defaultProps.onChange).not.toHaveBeenCalled();
    expect(screen.getByText('Título Inicial')).toBeInTheDocument();
  });

  it('salva alterações ao perder foco', () => {
    const onChange = jest.fn();
    const { rerender } = render(<EditableTitle value="Título Inicial" onChange={onChange} />);
    
    // Entra no modo edição
    fireEvent.doubleClick(screen.getByText('Título Inicial'));
    
    const input = screen.getByDisplayValue('Título Inicial');
    fireEvent.change(input, { target: { value: 'Título com Blur' } });
    fireEvent.blur(input);
    
    expect(onChange).toHaveBeenCalledWith('Título com Blur');
    
    // Re-renderiza com o novo valor
    rerender(<EditableTitle value="Título com Blur" onChange={onChange} />);
    
    expect(screen.getByText('Título com Blur')).toBeInTheDocument();
  });

  it('não salva texto vazio', () => {
    render(<EditableTitle {...defaultProps} />);
    
    // Entra no modo edição
    fireEvent.doubleClick(screen.getByText('Título Inicial'));
    
    const input = screen.getByDisplayValue('Título Inicial');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.blur(input);
    
    // Não deve chamar onChange com texto vazio
    expect(defaultProps.onChange).not.toHaveBeenCalled();
    expect(screen.getByText('Título Inicial')).toBeInTheDocument();
  });

  it('mostra tooltip no título', () => {
    render(<EditableTitle {...defaultProps} />);
    
    const title = screen.getByText('Título Inicial');
    expect(title).toHaveAttribute('title', 'Clique duas vezes para renomear o projeto');
  });

  it('mantém texto original se cancelar edição', () => {
    render(<EditableTitle {...defaultProps} />);
    
    // Entra no modo edição
    fireEvent.doubleClick(screen.getByText('Título Inicial'));
    
    const input = screen.getByDisplayValue('Título Inicial');
    fireEvent.change(input, { target: { value: 'Texto Temporário' } });
    
    // Cancela com Escape
    fireEvent.keyDown(input, { key: 'Escape' });
    
    expect(defaultProps.onChange).not.toHaveBeenCalled();
    expect(screen.getByText('Título Inicial')).toBeInTheDocument();
  });
});