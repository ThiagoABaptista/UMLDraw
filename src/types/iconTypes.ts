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
  | 'activity' | 'decision' | 'start' | 'end' | 'fork' | 'join' | 'merge'
  | 'association' | 'inheritance' | 'composition' | 'aggregation' | 'dependency' | 'include' | 'extend' | 'flow';

export type ToolbarTool = 
  | 'select' | 'actor' | 'usecase' | 'activity' | 'decision' | 'relationship'
  | 'save' | 'load' | 'export';