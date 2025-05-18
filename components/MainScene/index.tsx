import { KonvaNode } from "@/types";
import { FC } from "react";
import { Layer } from "react-konva";
import { NodesScene } from "@/components/NodesScene";

interface Props {
  width: number;
  height: number;
  scale: number;
  nodes: KonvaNode[];
}

export const MainScene: FC<Props> = ({ width, height, scale, nodes }) => {
  return (
    <Layer width={width} height={height} scaleX={scale} scaleY={scale}>
      <NodesScene nodes={nodes} />
    </Layer>
  );
};
