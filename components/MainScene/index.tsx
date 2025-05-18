import { FC } from "react";
import { Group, Layer } from "react-konva";
import { MODES } from "@/types";
import { Circle, Text } from "react-konva";
import { useAppSelector } from "@/hooks";
import {
  addNewEdgeNode,
  graphModeSelector,
  graphNodesSelector,
  newEdgeNodesSelector,
  removeNode,
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
            />
            {newEdgeNodes.indexOf(node.id) != -1 && (
              <Text
                x={node.x - 10}
                y={node.y - 10}
                width={20}
                height={20}
                align="center"
                verticalAlign="middle"
                text={`${newEdgeNodes.indexOf(node.id) + 1}`}
              />
            )}
          </Group>
        ))}
      </Layer>
    </>
  );
};
