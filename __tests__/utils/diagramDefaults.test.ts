import { UML_DEFAULTS, getElementDefaults } from '../../src/utils/diagramDefaults';

describe('diagramDefaults', () => {
  describe('UML_DEFAULTS', () => {
    it('contém configurações padrão para todos os tipos de elementos', () => {
      expect(UML_DEFAULTS.actor).toEqual({ width: 70, height: 70, scaleBoost: 3.0 });
      expect(UML_DEFAULTS.usecase).toEqual({ width: 140, height: 100, scaleBoost: 1.8 });
      expect(UML_DEFAULTS.activity).toEqual({ width: 140, height: 70, scaleBoost: 1.6 });
      expect(UML_DEFAULTS.start).toEqual({ width: 40, height: 40, scaleBoost: 2.0 });
    });

    it('tem dimensões específicas para elementos de fork e join', () => {
      expect(UML_DEFAULTS.fork).toEqual({ width: 5, height: 160, scaleBoost: 2.0 });
      expect(UML_DEFAULTS.join).toEqual({ width: 5, height: 160, scaleBoost: 2.0 });
    });
  });

  describe('getElementDefaults', () => {
    it('retorna configurações para tipo conhecido', () => {
      const result = getElementDefaults('activity');
      expect(result).toEqual({ width: 140, height: 70, scaleBoost: 1.6 });
    });

    it('retorna fallback para tipo desconhecido', () => {
      const result = getElementDefaults('unknown-type');
      expect(result).toEqual({ width: 100, height: 60, scaleBoost: 1.0 });
    });

    it('retorna configurações para todos os tipos definidos', () => {
      Object.keys(UML_DEFAULTS).forEach(type => {
        const result = getElementDefaults(type);
        expect(result).toEqual(UML_DEFAULTS[type]);
      });
    });
  });
});