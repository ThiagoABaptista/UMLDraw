export interface UseCaseElement {
  id: string;
  type: 'actor' | 'usecase' | 'system';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isEditing?: boolean;
}

export interface ActivityElement {
  id: string;
  type: 'start' | 'end' | 'activity' | 'decision' | 'merge' | 'fork' | 'join';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isEditing?: boolean;
}

export interface UMLRelationship {
  id: string;
  from: string;       // ID do elemento de origem
  to: string;         // ID do elemento de destino
  type: RelationshipType;
  label?: string;
}

export interface UMLDiagram {
  metadata: DiagramMetadata;
  elements: (UseCaseElement | ActivityElement)[];
  relationships: UMLRelationship[];
}

export interface DiagramMetadata {
  version: string;
  name: string;
  created: string;
  lastModified: string;
  type: 'usecase' | 'activity';
}

export interface DiagramFile {
  metadata: DiagramMetadata;
  elements: (UseCaseElement | ActivityElement)[];
  relationships: UMLRelationship[];
  viewport?: { scale: number; offset: { x: number; y: number } };
}

export type Tool =
  | "select"
  | "actor"
  | "usecase"
  | "relationship"
  | "activity"
  | "decision"
  | "start"
  | "end"
  | "fork"
  | "join"
  | "merge";
export type CreationState = 'idle' | 'placing';
export type ConnectionState = 'idle' | 'selecting-first' | 'selecting-second';
export type RelationshipType = 'association' | 'include' | 'extend' | 'generalization' | 'flow';