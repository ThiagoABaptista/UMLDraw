export interface ParsedSvg {
  paths: string[];
  viewBox: { minX: number; minY: number; width: number; height: number };
  translate: { x: number; y: number }; // acumulado das translates nos <g>
}

export const parseSvgContent = (svgContent: string): ParsedSvg => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");

  // pega todos os paths (conteúdo 'd')
  const paths = Array.from(svgDoc.querySelectorAll("path")).map(
    (p) => p.getAttribute("d") || ""
  );

  // pega o viewBox do elemento <svg>
  const viewBoxAttr = svgDoc.documentElement.getAttribute("viewBox");
  let viewBox = { minX: 0, minY: 0, width: 24, height: 24 };

  if (viewBoxAttr) {
    const parts = viewBoxAttr.trim().split(/\s+|,/).map((v) => parseFloat(v));
    if (parts.length === 4) {
      const [minX, minY, width, height] = parts;
      viewBox = { minX, minY, width, height };
    }
  }

  // soma traduções 'translate(x,y)' encontradas em todos os <g> (ajusta paths que usam coordenadas absolutas)
  let totalTx = 0;
  let totalTy = 0;
  const groups = Array.from(svgDoc.querySelectorAll("g"));
  const translateRegex = /translate\(\s*([-\d.]+)(?:[ ,]+([-\d.]+))?\s*\)/;

  groups.forEach((g) => {
    const t = g.getAttribute("transform");
    if (!t) return;
    const m = translateRegex.exec(t);
    if (m) {
      totalTx += parseFloat(m[1]);
      totalTy += parseFloat(m[2] ?? "0");
    }
  });

  // também verifique transform em paths individuais (caso exista)
  const pathNodes = Array.from(svgDoc.querySelectorAll("path"));
  pathNodes.forEach((p) => {
    const t = p.getAttribute("transform");
    if (!t) return;
    const m = translateRegex.exec(t);
    if (m) {
      totalTx += parseFloat(m[1]);
      totalTy += parseFloat(m[2] ?? "0");
    }
  });

  return {
    paths,
    viewBox,
    translate: { x: totalTx, y: totalTy }
  };
};
