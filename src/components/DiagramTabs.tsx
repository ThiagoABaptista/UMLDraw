import React from "react";
import { X, Plus } from "lucide-react";
import { UMLDiagram } from "../types/umlTypes";

interface DiagramTabsProps {
  diagrams: UMLDiagram[];
  activeIndex: number;
  onSwitch: (index: number) => void;
  onNew: () => void;
  onDelete: (index: number) => void;
}

export const DiagramTabs: React.FC<DiagramTabsProps> = ({
  diagrams,
  activeIndex,
  onSwitch,
  onNew,
  onDelete,
}) => {
  return (
    <div className="diagram-tabs-container" data-testid="diagram-tabs">
      <div className="diagram-tabs-bar">
        {diagrams.map((d, i) => (
          <div
            key={d.metadata.name}
            className={`diagram-tab ${i === activeIndex ? "active" : ""}`}
            onClick={() => onSwitch(i)}
            data-testid={`tab-${i}`}
          >
            {d.metadata.name}
            <X
              size={14}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(i);
              }}
              data-testid="x-icon"
            />
          </div>
        ))}
      </div>
      <button 
        className="diagram-tab-new" 
        onClick={onNew} 
        title="Novo Diagrama"
        data-testid="new-tab-btn"
      >
        <Plus size={16} data-testid="plus-icon" />
      </button>
    </div>
  );
};