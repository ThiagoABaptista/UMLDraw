import React from "react";
import { Group, Circle, Line, Ellipse, Rect } from "react-konva";

// Props comuns com seleção suave
const getCommonProps = (
  strokeColor: string,
  strokeWidth: number,
  isSelected: boolean
) => ({
  stroke: "#000000", // 🔹 Linhas sempre pretas
  strokeWidth,
  shadowColor: isSelected ? strokeColor : "transparent",
  shadowBlur: isSelected ? 8 : 0,
  shadowOpacity: isSelected ? 0.25 : 0,
  listening: true,
  fillEnabled: false,
});

// === 🧍 Ator (Stickman) ===
export const drawActor = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  strokeWidth: number,
  isSelected: boolean
) => {
  const stroke = "#000000"; // 🔹 Linhas sempre pretas
  const props = {
    stroke,
    strokeWidth,
    shadowColor: isSelected ? stroke : "transparent",
    shadowBlur: isSelected ? 6 : 0,
    shadowOpacity: isSelected ? 0.2 : 0,
    listening: true,
  };

  // 🎨 proporções ajustadas
  const headRadius = Math.min(width, height) * 0.12;
  const headCenterX = width / 2;
  const headCenterY = headRadius + 2;

  const bodyTopY = headCenterY + headRadius + 2;
  const bodyBottomY = height * 0.6;

  const armY = bodyTopY + (bodyBottomY - bodyTopY) * 0.25;
  const armLength = width * 0.35;

  const legSpread = width * 0.25;
  const legEndY = height * 0.95;

  return (
    <Group x={x} y={y} listening>
      <Circle x={headCenterX} y={headCenterY} radius={headRadius} {...props} />
      <Line points={[headCenterX, bodyTopY, headCenterX, bodyBottomY]} {...props} />
      <Line points={[headCenterX - armLength, armY, headCenterX + armLength, armY]} {...props} />
      <Line points={[headCenterX, bodyBottomY, headCenterX - legSpread, legEndY]} {...props} />
      <Line points={[headCenterX, bodyBottomY, headCenterX + legSpread, legEndY]} {...props} />
    </Group>
  );
};

// === 🟢 Caso de Uso ===
export const drawUseCase = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  strokeWidth: number,
  isSelected: boolean
) => {
  const stroke = "#000000"; // 🔹 Linhas sempre pretas
  const props = {
    stroke,
    strokeWidth,
    shadowColor: isSelected ? stroke : "transparent",
    shadowBlur: isSelected ? 6 : 0,
    shadowOpacity: isSelected ? 0.2 : 0,
    listening: true,
  };

  const cx = width / 2;
  const cy = height / 2;
  const rx = width * 0.50;
  const ry = height * 0.4;

  return (
    <Group x={x} y={y} listening>
      {/* camada preenchida */}
      <Ellipse x={cx} y={cy} radiusX={rx} radiusY={ry} {...props} />
    </Group>
  );
};


// === 🟦 Atividade ===
export const drawActivity = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  strokeWidth: number,
  isSelected: boolean
) => {
  const props = getCommonProps(color, strokeWidth, isSelected);
  const corner = Math.min(width, height) * 0.2;

  return (
    <Group x={x} y={y} listening>
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        cornerRadius={corner}
        {...props}
      />
    </Group>
  );
};

// === ⚫ Start Node ===
export const drawStart = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  strokeWidth: number,
  isSelected: boolean
) => {
  const r = Math.min(width, height) / 2;
  const cx = width / 2;
  const cy = height / 2;

  return (
    <Group x={x} y={y} listening>
      <Circle
        x={cx}
        y={cy}
        radius={r}
        fill={color}
        stroke={isSelected ? "#6366f1" : "transparent"} // 🟣 borda roxa quando selecionado
        strokeWidth={isSelected ? strokeWidth : 0}
      />
    </Group>
  );
};

// === 🔴 End Node ===
export const drawEnd = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  strokeWidth: number,
  isSelected: boolean
) => {
  const r = Math.min(width, height) / 2;
  const cx = width / 2;
  const cy = height / 2;

  return (
    <Group x={x} y={y} listening>
      {/* círculo externo */}
      <Circle
        x={cx}
        y={cy}
        radius={r}
        stroke={isSelected ? "#6366f1" : color}
        strokeWidth={strokeWidth}
      />
      {/* círculo interno */}
      <Circle x={cx} y={cy} radius={r * 0.65} fill={color} />
    </Group>
  );
};

// === 🔶 Decisão ===
export const drawDecision = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  strokeWidth: number,
  isSelected: boolean
) => {
  const props = getCommonProps(color, strokeWidth, isSelected);
  const hw = width / 2;
  const hh = height / 2;
  const points = [hw, 0, width, hh, hw, height, 0, hh];

  return (
    <Group x={x} y={y} listening>
      <Line points={points} closed {...props} />
    </Group>
  );
};

// === 🟫 Fork / Join (orientação automática) ===
export const drawFork = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  _strokeWidth: number,
  _isSelected: boolean
) => {
  const isHorizontal = width > height * 1.5; // se largura for bem maior, é horizontal

  if (isHorizontal) {
    // 🔸 Barra horizontal (largura longa, altura fina)
    const barHeight = Math.min(height * 0.15, 12);
    const offsetY = (height - barHeight) / 2;
    return (
      <Group x={x} y={y} listening>
        <Rect
          x={0}
          y={offsetY}
          width={width}
          height={barHeight}
          fill={color}
        />
      </Group>
    );
  } else {
    // 🔹 Barra vertical (altura longa, largura fina)
    const barWidth = Math.min(width * 0.15, 12);
    const offsetX = (width - barWidth) / 2;
    return (
      <Group x={x} y={y} listening>
        <Rect
          x={offsetX}
          y={0}
          width={barWidth}
          height={height}
          fill={color}
        />
      </Group>
    );
  }
};

export const drawJoin = drawFork;

// === 🟣 Merge ===
export const drawMerge = drawDecision;
