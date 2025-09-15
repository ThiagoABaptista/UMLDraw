import React, { useState, useRef, useEffect } from 'react';
import { Text, Group } from 'react-konva';

interface EditableTextProps {
  x: number;
  y: number;
  width: number;
  text: string;
  fontSize?: number;
  fontStyle?: string;
  fill?: string;
  backgroundColor?: string;
  onEditStart?: () => void;
  onEditEnd: (newText: string) => void;
  isEditing?: boolean;
  align?: 'left' | 'center' | 'right';
}

export const EditableText: React.FC<EditableTextProps> = ({
  x,
  y,
  width,
  text,
  fontSize = 14,
  fontStyle = 'normal',
  fill = '#374151',
  backgroundColor = 'white',
  onEditStart,
  onEditEnd,
  isEditing = false,
  align = 'left'
}) => {
  const [isEditingInternal, setIsEditing] = useState(isEditing);
  const [currentText, setCurrentText] = useState(text);
  const textRef = useRef<any>(null);
  const groupRef = useRef<any>(null);

  useEffect(() => {
    setCurrentText(text);
  }, [text]);

  useEffect(() => {
    if (isEditingInternal && textRef.current && groupRef.current) {
      // Esconde o texto original temporariamente
      textRef.current.hide();
      
      // Obtém a posição absoluta do grupo
      const group = groupRef.current;
      const absPos = group.getAbsolutePosition();
      
      // Obtém o estágio
      const stage = group.getStage();
      if (!stage) return;
      
      // Obtém o container do stage
      const container = stage.container();
      const containerRect = container.getBoundingClientRect();
      
      // Calcula a posição correta relativa à página
      const scale = stage.scaleX();
      const textareaX = containerRect.left + absPos.x + x * scale;
      const textareaY = containerRect.top + absPos.y + y * scale;
      
      // Determina a cor do texto com base no fundo
      const getTextColorForBackground = (bgColor: string) => {
        if (bgColor === '#3b82f6' || bgColor === '#2563eb' || bgColor === '#1d4ed8') {
          return 'white';
        }
        return '#374151';
      };
      
      const textColor = getTextColorForBackground(backgroundColor);
      
      // Cria o textarea
      const textarea = document.createElement('textarea');
      textarea.className = 'editable-textarea';
      textarea.style.position = 'fixed';
      textarea.style.top = `${textareaY}px`;
      textarea.style.left = `${textareaX}px`;
      textarea.style.width = `${width * scale}px`;
      textarea.style.fontSize = `${fontSize * scale}px`;
      textarea.style.fontFamily = 'Arial, sans-serif';
      textarea.style.fontStyle = fontStyle;
      textarea.style.background = backgroundColor;
      textarea.style.color = textColor;
      textarea.value = currentText;
      
      document.body.appendChild(textarea);
      
      // Configura os event listeners
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSave(textarea);
        } else if (e.key === 'Escape') {
          handleCancel(textarea);
        }
        
        // Auto-ajusta a altura
        setTimeout(() => {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        }, 0);
      };

      const handleClickOutside = (e: MouseEvent) => {
        if (!textarea.contains(e.target as Node)) {
          handleSave(textarea);
        }
      };

      const handleBlur = () => {
        handleSave(textarea);
      };

      const handleSave = (textareaElement: HTMLTextAreaElement) => {
        const newValue = textareaElement.value;
        cleanup(textareaElement);
        onEditEnd(newValue);
      };

      const handleCancel = (textareaElement: HTMLTextAreaElement) => {
        cleanup(textareaElement);
        setCurrentText(text);
      };

      const cleanup = (textareaElement: HTMLTextAreaElement) => {
        // Remove event listeners
        document.removeEventListener('mousedown', handleClickOutside);
        textareaElement.removeEventListener('keydown', handleKeyDown);
        textareaElement.removeEventListener('blur', handleBlur);
        
        // Remove o textarea
        if (document.body.contains(textareaElement)) {
          document.body.removeChild(textareaElement);
        }
        
        setIsEditing(false);
        if (textRef.current) {
          textRef.current.show();
        }
      };

      // Adiciona event listeners
      textarea.addEventListener('keydown', handleKeyDown);
      textarea.addEventListener('blur', handleBlur);
      document.addEventListener('mousedown', handleClickOutside);

      // Auto-ajusta a altura inicial
      setTimeout(() => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }, 0);

      // Foca e seleciona o texto
      setTimeout(() => {
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }, 10);

      return () => {
        if (document.body.contains(textarea)) {
          cleanup(textarea);
        }
      };
    }
  }, [isEditingInternal, currentText, width, fontSize, x, y, fill, fontStyle, backgroundColor]);

  useEffect(() => {
    if (isEditing) {
      setIsEditing(true);
    }
  }, [isEditing]);

  const handleDblClick = () => {
    setIsEditing(true);
    onEditStart?.();
  };

  return (
    <Group ref={groupRef}>
      <Text
        ref={textRef}
        x={x}
        y={y}
        text={currentText}
        fontSize={fontSize}
        fontStyle={fontStyle}
        fill={fill}
        width={width}
        onDblClick={handleDblClick}
        onTap={handleDblClick}
        align={align || 'left'}
      />
    </Group>
  );
};