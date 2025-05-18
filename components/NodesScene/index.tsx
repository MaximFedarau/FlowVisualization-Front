import { KonvaNode, MODES } from "@/types";
import { FC } from "react";
import { Circle } from "react-konva";
import { useAppSelector } from "@/hooks";
import { graphModeSelector } from "@/store/graph";
import { KonvaEventObject } from "konva/lib/Node";

interface Props {
  nodes: KonvaNode[];
}

export const NodesScene: FC<Props> = ({ nodes }) => {
  const graphMode = useAppSelector(graphModeSelector);

  const handleClick = (event: KonvaEventObject<MouseEvent>) => {
    event.cancelBubble = true;
  };

  return (
    <>
      {nodes.map((node, index, arr) => (
        <Circle
          key={index}
          x={node.x}
          y={node.y}
          radius={20}
          fill={index === 0 || index === arr.length - 1 ? "red" : "white"}
          stroke="black"
          strokeWidth={0.3}
          draggable={graphMode === MODES.DEFAULT}
          onClick={handleClick}
        />
      ))}
    </>
  );
};
