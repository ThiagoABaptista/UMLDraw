import { umlSvgColors } from "./umlSvgColors";

export interface UseCaseElement {
  id: string;
  type: 'actor' | 'usecase' | 'object' | 'note' | 'association' | 'generalization' | 'extend' | 'include';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isEditing?: boolean;
  color?: keyof typeof umlSvgColors;
}

export interface ActivityElement {
  id: string;
  type: 'start' | 'end' | 'activity' | 'decision' | 'merge' | 'fork' | 'join' | 'control_flow' | 'realization' | 'swimlane' | 'end_flow';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isEditing?: boolean;
  color?: keyof typeof umlSvgColors;
}

export interface UMLRelationship {
  id: string;
  from: string;       // ID do elemento de origem
  to: string;         // ID do elemento de destino
  type: RelationshipType;
  label?: string;
  guard?: string;    // Condição para fluxos de controle
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
export type RelationshipType =
  | 'association'
  | 'include'
  | 'extend'
  | 'generalization'
  | 'dependency'
  | 'control_flow'
  | 'object_flow';