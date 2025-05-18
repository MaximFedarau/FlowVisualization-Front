import { MODES } from "@/types";
import { FC } from "react";
import { Circle } from "react-konva";
import { useAppSelector } from "@/hooks";
import {
  graphModeSelector,
  graphNodesSelector,
  removeNode,
} from "@/store/graph";
import { KonvaEventObject } from "konva/lib/Node";
import { useDispatch } from "react-redux";

export const NodesScene: FC = () => {
  const graphMode = useAppSelector(graphModeSelector);
  const graphNodes = useAppSelector(graphNodesSelector);
  const dispatch = useDispatch();

  const handleClick = (event: KonvaEventObject<MouseEvent>, id: number) => {
    event.cancelBubble = true;

    if (graphMode === MODES.DEFAULT && event.evt.detail >= 2) {
      dispatch(removeNode(id));
    }
  };

  return (
    <>
      {graphNodes.map((node) => (
        <Circle
          key={node.id}
          x={node.x}
          y={node.y}
          radius={20}
          fill={node.is_sink || node.is_source ? "#F88379" : "white"}
          stroke="black"
          strokeWidth={0.3}
          draggable={graphMode === MODES.DEFAULT}
          onClick={(event) => handleClick(event, node.id)}
        />
      ))}
    </>
  );
};
