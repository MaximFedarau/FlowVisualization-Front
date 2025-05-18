import { FC } from "react";
import { Layer } from "react-konva";
import { NodesScene } from "@/components/NodesScene";

interface Props {
  width: number;
  height: number;
  scale: number;
}

export const MainScene: FC<Props> = ({ width, height, scale }) => {
  return (
    <Layer width={width} height={height} scaleX={scale} scaleY={scale}>
      <NodesScene />
    </Layer>
  );
};
