import { useAppDispatch, useAppSelector } from "@/hooks";
import { graphEdgesSelector, graphNodesSelector } from "@/store/graph";
import {
  frameActionIndexSelector,
  setFrameActionIndex,
  visualizationSelector,
} from "@/store/visualization";
import { GraphEdge, VisualizationAction } from "@/types";
import { FC, useEffect } from "react";
import { Layer, Group, Circle, Arrow, Text } from "react-konva";

const findEdgeInVisualization = (
  edge: GraphEdge,
  action?: VisualizationAction
) => {
  if (!action) {
    return null;
  }

  for (const currentEdge of action.way) {
    if (currentEdge.from_ === edge.from_id && currentEdge.to === edge.to_id) {
      return currentEdge;
    }
  }
  return null;
};

export const VisualizationScene: FC = () => {
  const visualization = useAppSelector(visualizationSelector);
  const graphNodes = useAppSelector(graphNodesSelector);
  const graphEdges = useAppSelector(graphEdgesSelector);
  const frameActionIndex = useAppSelector(frameActionIndexSelector);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (frameActionIndex + 1 >= visualization.visualization.length) {
        clearInterval(intervalId);
      } else {
        dispatch(setFrameActionIndex(frameActionIndex + 1));
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [frameActionIndex, visualization, dispatch]);

  return (
    <Layer>
      {graphNodes.map((node) => (
        <Group key={node.id}>
          <Circle
            x={node.x}
            y={node.y}
            radius={20}
            fill={node.is_sink || node.is_source ? "#F88379" : "white"}
            stroke="black"
            strokeWidth={0.3}
          />
        </Group>
      ))}
      {graphEdges.map((edge) => {
        const startNode = graphNodes.find((node) => node.id === edge.from_id)!;
        const endNode = graphNodes.find((node) => node.id === edge.to_id)!;
        const visualizationEdge = findEdgeInVisualization(
          edge,
          visualization.visualization[frameActionIndex]
        );
        return (
          <Group key={edge.id}>
            <Arrow
              key={edge.id}
              points={[
                startNode.actualX,
                startNode.actualY,
                endNode.actualX,
                endNode.actualY,
              ]}
              fill={visualizationEdge ? "red" : "black"}
              stroke={visualizationEdge ? "red" : "black"}
              strokeWidth={visualizationEdge ? 1 : 0.5}
            />
            {visualizationEdge && (
              <Text
                x={(startNode.actualX + endNode.actualX) / 2}
                y={(startNode.actualY + endNode.actualY) / 2}
                fontSize={14}
                fontStyle="bold"
                text={`Capacity: ${visualizationEdge.capacity} \n Flow: ${visualizationEdge.flow}`}
              />
            )}
          </Group>
        );
      })}
    </Layer>
  );
};
