import { FC } from "react";
import { Arrow, Group, Layer } from "react-konva";
import { MODES } from "@/types";
import { Circle, Text } from "react-konva";
import { useAppSelector } from "@/hooks";
import {
  addNewEdgeNode,
  graphEdgesSelector,
  graphModeSelector,
  graphNodesSelector,
  newEdgeNodesSelector,
  removeNode,
  updateNodePosition,
} from "@/store/graph";
import { KonvaEventObject } from "konva/lib/Node";
import { useDispatch } from "react-redux";

interface Props {
  width: number;
  height: number;
  scale: number;
  openNewEdgeDialog: () => void;
}

export const MainScene: FC<Props> = ({
  width,
  height,
  scale,
  openNewEdgeDialog,
}) => {
  const graphMode = useAppSelector(graphModeSelector);
  const graphNodes = useAppSelector(graphNodesSelector);
  const graphEdges = useAppSelector(graphEdgesSelector);
  const newEdgeNodes = useAppSelector(newEdgeNodesSelector);
  const dispatch = useDispatch();

  const handleClick = (event: KonvaEventObject<MouseEvent>, id: number) => {
    event.cancelBubble = true;

    if (graphMode === MODES.DEFAULT && event.evt.detail >= 2) {
      dispatch(removeNode(id));
    }

    if (graphMode === MODES.EDGE) {
      const selectedNode = graphNodes.find((node) => node.id === id);

      if (selectedNode && selectedNode.is_sink && newEdgeNodes.length === 0) {
        return;
      }

      if (selectedNode && selectedNode.is_source && newEdgeNodes.length === 1) {
        return;
      }

      dispatch(addNewEdgeNode(id));
      if (newEdgeNodes.length == 1) {
        openNewEdgeDialog();
        return;
      }
    }
  };

  const handleTap = (event: KonvaEventObject<Event>, id: number) => {
    event.cancelBubble = true;

    if (graphMode === MODES.EDGE) {
      const selectedNode = graphNodes.find((node) => node.id === id);

      if (selectedNode && selectedNode.is_sink && newEdgeNodes.length === 0) {
        return;
      }

      if (selectedNode && selectedNode.is_source && newEdgeNodes.length === 1) {
        return;
      }

      dispatch(addNewEdgeNode(id));
      if (newEdgeNodes.length == 1) {
        openNewEdgeDialog();
        return;
      }
    }
  };

  const handleDoubleTap = (id: number) => {
    if (graphMode === MODES.DEFAULT) {
      dispatch(removeNode(id));
    }
  };

  const handleNodeDrag = (x: number, y: number, id: number) => {
    dispatch(updateNodePosition({ x, y, id }));
  };

  return (
    <>
      <Layer width={width} height={height} scaleX={scale} scaleY={scale}>
        {graphNodes.map((node) => (
          <Group key={node.id}>
            <Circle
              x={node.x}
              y={node.y}
              radius={20}
              fill={node.is_sink || node.is_source ? "#F88379" : "white"}
              stroke="black"
              strokeWidth={0.3}
              draggable={graphMode === MODES.DEFAULT}
              onClick={(event) => handleClick(event, node.id)}
              onDragMove={(event) =>
                handleNodeDrag(event.target.x(), event.target.y(), node.id)
              }
              onTap={(event) => handleTap(event, node.id)}
              onDblTap={() => handleDoubleTap(node.id)}
            />
            {newEdgeNodes.indexOf(node.id) != -1 && (
              <Text
                x={node.actualX - 10}
                y={node.actualY - 10}
                width={20}
                height={20}
                align="center"
                verticalAlign="middle"
                text={`${newEdgeNodes.indexOf(node.id) + 1}`}
              />
            )}
          </Group>
        ))}
        {graphEdges.map((edge) => {
          const startNode = graphNodes.find(
            (node) => node.id === edge.from_id
          )!;
          const endNode = graphNodes.find((node) => node.id === edge.to_id)!;
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
                fill="black"
                stroke="black"
                strokeWidth={0.5}
              />
              <Text
                x={(startNode.actualX + endNode.actualX) / 2}
                y={(startNode.actualY + endNode.actualY) / 2}
                fontSize={16}
                fontStyle="bold"
                text={`${edge.capacity}`}
              />
            </Group>
          );
        })}
      </Layer>
    </>
  );
};
