import { FC, useState, useEffect } from "react";
import { Layer, Line } from "react-konva";

const GRID_STEP = 24;

const recalculateGridPoints = (globalWidth: number, globalHeight: number) => {
  const gridWidth = Math.max(globalWidth, globalHeight) / GRID_STEP;
  const gridHeight = Math.max(globalWidth, globalHeight) / GRID_STEP;
  const points: number[][] = [];
  for (let i = 0; i < GRID_STEP; ++i) {
    points.push([gridWidth * i, 0, gridWidth * i, globalHeight]);
    points.push([0, gridHeight * i, globalWidth, gridHeight * i]);
  }
  return points;
};

export const Grid: FC = () => {
  const [points, setPoints] = useState<number[][]>([]);

  const updateGridOnResize = () => {
    setPoints(recalculateGridPoints(window.innerWidth, window.innerHeight));
  };

  useEffect(() => {
    updateGridOnResize();
    window.addEventListener("resize", updateGridOnResize);
    return () => window.removeEventListener("resize", updateGridOnResize);
  }, []);

  return (
    <Layer>
      {points.map((point, index) => (
        <Line points={point} key={index} stroke="lightgray" strokeWidth={1} />
      ))}
    </Layer>
  );
};
