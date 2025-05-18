import { KonvaNode } from "@/types";
import { FC } from "react";
import { Circle } from "react-konva";

interface Props {
  nodes: KonvaNode[];
}

export const NodesScene: FC<Props> = ({ nodes }) => {
  return (
    <>
      {nodes.map((node, index) => (
        <Circle
          key={index}
          x={node.x}
          y={node.y}
          radius={20}
          fill="white"
          stroke="black"
          strokeWidth={0.3}
        />
      ))}
    </>
  );
};
