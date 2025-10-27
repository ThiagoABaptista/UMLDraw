import React, { useState, useRef, useEffect } from "react";
import { Text, Group } from "react-konva";

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
  align?: "left" | "center" | "right";
}

export const EditableText: React.FC<EditableTextProps> = ({
  x,
  y,
  width,
  text,
  fontSize = 14,
  fontStyle = "normal",
  fill = "#111827",
  backgroundColor = "transparent",
  onEditStart,
  onEditEnd,
  isEditing = false,
  align = "left",
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
      textRef.current.hide();

      const group = groupRef.current;
      const absPos = group.getAbsolutePosition();
      const stage = group.getStage();
      if (!stage) return;

      const container = stage.container();
      const containerRect = container.getBoundingClientRect();
      const scale = stage.scaleX();

      // Coordenadas absolutas na página
      // 🧭 Ajuste preciso da posição do textarea
      const textNode = textRef.current;
      const textMetrics = textNode.getClientRect();
      const offsetY = textMetrics.height / 2 - fontSize / 2; // centraliza verticalmente

      const textareaX = containerRect.left + (absPos.x + textNode.x()) * scale;
      const textareaY = containerRect.top + (absPos.y + textNode.y() + offsetY) * scale;

      // ✨ Cria o campo de texto invisível
      const textarea = document.createElement("textarea");
      textarea.className = "editable-textarea";
      textarea.value = currentText;

      // Aplica apenas posicionamento e dimensões — o visual vem do CSS
      textarea.style.position = "fixed";
      textarea.style.top = `${textareaY}px`;
      textarea.style.left = `${textareaX}px`;
      textarea.style.width = `${width * scale}px`;
      textarea.style.fontSize = `${fontSize * scale}px`;
      textarea.style.fontFamily = `'Inter', sans-serif`;
      textarea.style.fontStyle = fontStyle;
      textarea.style.fontWeight = "400";
      textarea.style.color = fill;
      textarea.style.background = "transparent";
      textarea.style.border = "none";
      textarea.style.outline = "none";
      textarea.style.padding = "0";
      textarea.style.margin = "0";
      textarea.style.resize = "none";
      textarea.style.lineHeight = "1";
      textarea.style.overflow = "hidden";
      textarea.style.whiteSpace = "pre";
      textarea.style.boxShadow = "none";
      textarea.style.textAlign = align;
      textarea.style.zIndex = "1000";
      textarea.style.caretColor = fill;
      textarea.style.transition = "opacity 0.15s ease-in-out";
      textarea.style.opacity = "0";
      textarea.style.background = "rgba(255, 255, 255, 0.3)";

      // === Anexa ao DOM ===
      document.body.appendChild(textarea);

      // Fade-in suave
      requestAnimationFrame(() => {
        textarea.style.opacity = "1";
      });

      // 🧠 Funções auxiliares
      const resizeTextarea = () => {
        textarea.style.height = "auto";
        textarea.style.width = "auto";

        // Mede o texto atual
        const context = document.createElement("canvas").getContext("2d");
        if (context) {
          context.font = `${fontStyle} ${fontSize * scale}px Inter, sans-serif`;
          const metrics = context.measureText(textarea.value || "a");
          const newWidth = Math.max(metrics.width + 10, width * scale);
          textarea.style.width = `${newWidth}px`;
        }

        textarea.style.height = `${textarea.scrollHeight}px`;
      };

      const handleSave = () => {
        const newValue = textarea.value.trim();
        cleanup();
        onEditEnd(newValue);
      };

      const handleCancel = () => {
        cleanup();
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSave();
        } else if (e.key === "Escape") {
          e.preventDefault();
          handleCancel();
        } else {
          resizeTextarea();
        }
      };

      const handleInput = () => resizeTextarea();

      const handleClickOutside = (e: MouseEvent) => {
        if (!textarea.contains(e.target as Node)) handleSave();
      };

      const cleanup = () => {
        textarea.style.opacity = "0";
        setTimeout(() => {
          document.removeEventListener("mousedown", handleClickOutside);
          textarea.removeEventListener("keydown", handleKeyDown);
          textarea.removeEventListener("input", handleInput);
          if (document.body.contains(textarea)) document.body.removeChild(textarea);
          textRef.current?.show();
          setIsEditing(false);
        }, 150);
      };

      textarea.addEventListener("keydown", handleKeyDown);
      textarea.addEventListener("input", handleInput);
      document.addEventListener("mousedown", handleClickOutside);

      // Foco inicial
      setTimeout(() => {
        resizeTextarea();
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }, 10);
    }
  }, [isEditingInternal]);

  useEffect(() => {
    if (isEditing) {
      setIsEditing(true);
      onEditStart?.();
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
        align={align || "left"}
      />
    </Group>
  );
};
