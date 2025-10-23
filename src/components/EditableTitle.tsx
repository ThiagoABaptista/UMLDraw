import React, { useState } from "react";

interface EditableTitleProps {
  value: string;
  onChange: (newValue: string) => void;
}

export const EditableTitle: React.FC<EditableTitleProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue.trim()) onChange(tempValue);
  };

  return (
    <div className="editable-title">
      {isEditing ? (
        <input
          className="editable-title-input"
          value={tempValue}
          autoFocus
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && handleBlur()}
        />
      ) : (
        <h2
          className="editable-title-text"
          onDoubleClick={() => setIsEditing(true)}
          title="Clique duas vezes para renomear o projeto"
        >
          {value}
        </h2>
      )}
    </div>
  );
};
