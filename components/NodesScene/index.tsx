import { KonvaNode } from "@/types";
import { FC } from "react";
import { Layer, Circle } from "react-konva";

interface Props {
  nodes: KonvaNode[];
}

export const NodesScene: FC<Props> = ({ nodes }) => {
  return (
    <Layer>
      {nodes.map((node, index) => (
        <Circle key={index} x={node.x} y={node.y} radius={16} fill="red" />
      ))}
    </Layer>
  );
};
