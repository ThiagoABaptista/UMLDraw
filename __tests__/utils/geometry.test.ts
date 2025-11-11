import { getBorderPoint } from '../../src/utils/geometry';

describe('geometry', () => {
  describe('getBorderPoint', () => {
    it('calcula ponto na borda para alvo à direita', () => {
      const result = getBorderPoint(0, 0, 100, 50, 200, 25);
      
      // O ponto deve estar na borda direita do retângulo
      expect(result.x).toBeCloseTo(100, 0); // Borda direita
      expect(result.y).toBeCloseTo(25, 0);  // Centro Y
    });

    it('calcula ponto na borda para alvo abaixo', () => {
      const result = getBorderPoint(0, 0, 100, 50, 50, 100);
      
      // O ponto deve estar na borda inferior do retângulo
      expect(result.x).toBeCloseTo(50, 0);  // Centro X
      expect(result.y).toBeCloseTo(50, 0);  // Borda inferior
    });

    it('calcula ponto na borda para alvo à esquerda', () => {
      const result = getBorderPoint(100, 100, 100, 50, 0, 125);
      
      // O ponto deve estar na borda esquerda do retângulo
      expect(result.x).toBeCloseTo(100, 0); // Borda esquerda (x=100)
      expect(result.y).toBeCloseTo(125, 0); // Mesma altura do alvo
    });

    it('calcula ponto na borda para alvo acima', () => {
      const result = getBorderPoint(100, 100, 100, 50, 150, 0);
      
      // O ponto deve estar na borda superior do retângulo
      expect(result.x).toBeCloseTo(150, 0); // Mesma posição X do alvo
      expect(result.y).toBeCloseTo(100, 0); // Borda superior (y=100)
    });

    it('calcula ponto na borda para alvo no canto', () => {
      const result = getBorderPoint(0, 0, 100, 100, 200, 200);
      
      // Deve escolher a borda baseada na proporção
      expect(result.x).toBeGreaterThan(0);
      expect(result.y).toBeGreaterThan(0);
      expect(result.x).toBeLessThanOrEqual(100);
      expect(result.y).toBeLessThanOrEqual(100);
    });

    it('lida com coordenadas negativas', () => {
      const result = getBorderPoint(0, 0, 100, 100, -50, -50);
      
      // Deve calcular ponto na borda oposta
      expect(result.x).toBeGreaterThanOrEqual(0);
      expect(result.y).toBeGreaterThanOrEqual(0);
    });
  });
});