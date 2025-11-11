require('@testing-library/jest-dom');

// Polyfill para TextEncoder/TextDecoder (necessário para jsPDF)
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock para react-konva
jest.mock('react-konva', () => {
  const React = require('react');
  
  const MockGroup = React.forwardRef(({ children, onClick, onDragMove, onDragEnd, listening, ...props }, ref) => {
    return React.createElement(
      'div',
      {
        ...props,
        'data-testid': 'konva-group',
        'data-listening': listening?.toString(),
        ref,
        onClick: () => onClick?.(),
        onDragStart: () => {
          const mockEvent = {
            target: { x: () => 50, y: () => 80 }
          };
          onDragMove?.(mockEvent);
        },
        onDragEnd: () => {
          const mockEvent = {
            target: { x: () => 50, y: () => 80 }
          };
          onDragEnd?.(mockEvent);
        }
      },
      children
    );
  });

  const MockStage = React.forwardRef(({ children, ...props }, ref) => {
    return React.createElement(
      'div',
      {
        ...props,
        'data-testid': 'konva-stage',
        ref,
      },
      children
    );
  });

  const MockLayer = React.forwardRef(({ children, ...props }, ref) => {
    return React.createElement(
      'div',
      {
        ...props,
        'data-testid': 'konva-layer',
        ref,
      },
      children
    );
  });

  return {
    Stage: MockStage,
    Layer: MockLayer,
    Group: MockGroup,
    Rect: (props) => React.createElement('div', { ...props, 'data-testid': 'konva-rect' }),
    Text: (props) => React.createElement('div', { ...props, 'data-testid': 'konva-text' }),
    Circle: (props) => React.createElement('div', { ...props, 'data-testid': 'konva-circle' }),
    Line: (props) => React.createElement('div', { ...props, 'data-testid': 'konva-line' }),
    Ellipse: (props) => React.createElement('div', { ...props, 'data-testid': 'konva-ellipse' }),
    Arrow: (props) => React.createElement('div', { ...props, 'data-testid': 'konva-arrow' }),
  };
});

// Mock para Konva
jest.mock('konva', () => ({
  ...jest.requireActual('konva'),
  Node: {
    prototype: {
      getClientRect: jest.fn(() => ({ x: 0, y: 0, width: 100, height: 100 }))
    }
  },
  KonvaEventObject: jest.fn(),
}));

// Mock para lucide-react icons
jest.mock('lucide-react', () => {
  const React = require('react');
  
  // Função auxiliar para criar ícones mockados
  const createMockIcon = (testId, displayText) => 
    React.forwardRef(({ size, onClick, className, ...props }, ref) => 
      React.createElement('span', { 
        'data-testid': testId,
        className,
        onClick, 
        ref,
        ...props 
      }, displayText)
    );

  return {
    User: createMockIcon('user-icon', '👤'),
    Square: createMockIcon('square-icon', '□'),
    Diamond: createMockIcon('diamond-icon', '◇'),
    ArrowRight: createMockIcon('arrow-right-icon', '→'),
    Save: createMockIcon('save-icon', '💾'),
    FileDown: createMockIcon('file-down-icon', '📥'),
    FolderOpen: createMockIcon('folder-open-icon', '📁'),
    X: createMockIcon('x-icon', '×'),
    Image: createMockIcon('image-icon', '🖼️'),
    GitFork: createMockIcon('git-fork-icon', '⎇'),
    GitMerge: createMockIcon('git-merge-icon', '⭮'),
    Trash2: createMockIcon('trash2-icon', '🗑️'),
    LayoutPanelLeft: createMockIcon('layout-panel-left-icon', '📑'),
    PanelRight: createMockIcon('panel-right-icon', '📑'),
    FilePlus: createMockIcon('file-plus-icon', '📄+'),
    ChevronUp: createMockIcon('chevron-up-icon', '↑'),
    ChevronDown: createMockIcon('chevron-down-icon', '↓'),
    Merge: createMockIcon('merge-icon', '⭮'),
    Circle: createMockIcon('circle-icon', '●'),
    CircleDot: createMockIcon('circle-dot-icon', '◎'),
    RectangleHorizontal: createMockIcon('rectangle-horizontal-icon', '▭'),
  };
});

// Mock para html2canvas e jsPDF para evitar problemas nos testes
jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({
    toDataURL: jest.fn(() => 'data:image/png;base64,mock'),
    width: 800,
    height: 600
  }))
}));

jest.mock('jspdf', () => {
  return {
    jsPDF: jest.fn().mockImplementation(() => ({
      addImage: jest.fn(),
      text: jest.fn(),
      setFontSize: jest.fn(),
      setFont: jest.fn(),
      setTextColor: jest.fn(),
      save: jest.fn(),
      internal: {
        pageSize: {
          getWidth: jest.fn(() => 595.28),
          getHeight: jest.fn(() => 841.89)
        }
      }
    }))
  };
});

// Mock inline para exportService - REMOVIDO O CAMINHO RELATIVO INCORRETO
// Em vez disso, vamos mockar diretamente nos testes que precisam

// Suprimir avisos específicos do React
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && 
        (args[0].includes('unrecognized in this browser') || 
         args[0].includes('ReactDOM.render is deprecated') ||
         args[0].includes('validateDOMNesting') ||
         args[0].includes('React does not recognize the') ||
         args[0].includes('Unknown event handler property') ||
         args[0].includes('Received `true` for a non-boolean attribute'))) {
      return;
    }
    originalError(...args);
  };

  console.warn = (...args) => {
    if (typeof args[0] === 'string' && 
        args[0].includes('Deprecation warning')) {
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Mock para URL.createObjectURL (necessário para testes de export)
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock para IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock para ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

global.ResizeObserver = MockResizeObserver;

// Mock para matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock para getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
    paddingLeft: '0px',
    paddingRight: '0px',
    paddingTop: '0px',
    paddingBottom: '0px',
    marginLeft: '0px',
    marginRight: '0px',
    marginTop: '0px',
    marginBottom: '0px',
  }),
});

// Mock para requestAnimationFrame
global.requestAnimationFrame = (cb) => {
  return setTimeout(cb, 0);
};

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};