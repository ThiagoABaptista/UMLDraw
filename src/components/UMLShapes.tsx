import React from "react";
import { Group, Circle, Line, Ellipse, Rect } from "react-konva";

/**
 * Retorna propriedades comuns de desenho com realce visual quando selecionado.
 */
const getCommonProps = (
  strokeColor: string,
  strokeWidth: number,
  isSelected: boolean
) => ({
  stroke: isSelected ? "#2563eb" : strokeColor, // azul quando selecionado
  strokeWidth: isSelected ? strokeWidth * 1.5 : strokeWidth,
  shadowColor: isSelected ? "#60a5fa" : "transparent",
  shadowBlur: isSelected ? 10 : 0,
  shadowOpacity: isSelected ? 0.7 : 0,
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
  const stroke = isSelected ? "#2563eb" : color;
  const shadow = isSelected ? "#60a5fa" : "transparent";

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

  const props = {
    stroke,
    strokeWidth: isSelected ? strokeWidth * 1.5 : strokeWidth,
    shadowColor: shadow,
    shadowBlur: isSelected ? 8 : 0,
    shadowOpacity: isSelected ? 0.6 : 0,
    listening: true,
  };

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
  const stroke = isSelected ? "#2563eb" : color;
  const shadow = isSelected ? "#60a5fa" : "transparent";
  const cx = width / 2;
  const cy = height / 2;
  const rx = width * 0.5;
  const ry = height * 0.4;

  return (
    <Group x={x} y={y} listening>
      <Ellipse
        x={cx}
        y={cy}
        radiusX={rx}
        radiusY={ry}
        stroke={stroke}
        strokeWidth={isSelected ? strokeWidth * 1.5 : strokeWidth}
        shadowColor={shadow}
        shadowBlur={isSelected ? 10 : 0}
        shadowOpacity={isSelected ? 0.6 : 0}
        fillEnabled={false}
      />
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
        stroke={isSelected ? "#2563eb" : "transparent"}
        strokeWidth={isSelected ? strokeWidth * 1.5 : 0}
        shadowColor={isSelected ? "#60a5fa" : "transparent"}
        shadowBlur={isSelected ? 10 : 0}
        shadowOpacity={isSelected ? 0.6 : 0}
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
      <Circle
        x={cx}
        y={cy}
        radius={r}
        stroke={isSelected ? "#2563eb" : color}
        strokeWidth={isSelected ? strokeWidth * 1.5 : strokeWidth}
        shadowColor={isSelected ? "#60a5fa" : "transparent"}
        shadowBlur={isSelected ? 10 : 0}
        shadowOpacity={isSelected ? 0.6 : 0}
      />
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

// === 🟫 Fork / Join ===
export const drawFork = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  strokeWidth: number,
  isSelected: boolean
) => {
  const fillColor = color;
  const stroke = isSelected ? "#2563eb" : "transparent";
  const barHeight = Math.min(height * 0.15, 12);
  const offsetY = (height - barHeight) / 2;

  return (
    <Group x={x} y={y} listening>
      <Rect
        x={0}
        y={offsetY}
        width={width}
        height={barHeight}
        fill={fillColor}
        stroke={stroke}
        strokeWidth={isSelected ? strokeWidth * 1.5 : 0}
        shadowColor={isSelected ? "#60a5fa" : "transparent"}
        shadowBlur={isSelected ? 10 : 0}
        shadowOpacity={isSelected ? 0.6 : 0}
      />
    </Group>
  );
};

// === 🟫 Join ===
export const drawJoin = drawFork;

// === 🟣 Merge ===
export const drawMerge = drawDecision;
