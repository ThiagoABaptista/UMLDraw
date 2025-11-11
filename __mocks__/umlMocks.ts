// __mocks__/umlMocks.ts
export const createMockDiagram = (type: 'usecase' | 'activity' = 'activity') => ({
  metadata: {
    version: '1.0',
    name: 'Mock Diagram',
    created: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    type
  },
  elements: [],
  relationships: []
});
