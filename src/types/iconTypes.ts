// src/types/iconTypes.ts
export interface IconPaths {
  elementIcons: {
    [key: string]: string;
  };
  toolbarIcons: {
    [key: string]: string;
  };
}

export type ElementType = 
  | 'actor' | 'usecase' | 'system'
  | 'activity' | 'decision' | 'start' | 'end' | 'end_flow'
  | 'fork' | 'join' | 'merge' | 'object' | 'note'
  | 'association' | 'generalization' | 'extend' | 'include'
  | 'control_flow' | 'realization' | 'swimlane';

export type ToolbarTool = 
  | 'select' | 'actor' | 'usecase' | 'activity' | 'decision' | 'relationship'
  | 'save' | 'load' | 'export';