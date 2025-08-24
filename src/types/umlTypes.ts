export interface UMLClass {
  id: string;
  name: string;
  attributes: string[];
  methods: string[];
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UMLRelationship {
  id: string;
  from: string;
  to: string;
  type: 'association' | 'inheritance' | 'composition' | 'aggregation';
}

export interface UMLDiagram {
  classes: UMLClass[];
  relationships: UMLRelationship[];
}