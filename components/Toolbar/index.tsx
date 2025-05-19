import { FC, useState } from "react";
import { ToolbarButton } from "@/components/ToolbarButton";
import {
  FaRegCircle,
  FaRandom,
  FaPlay,
  FaBackward,
  FaForward,
} from "react-icons/fa";
import { FaArrowPointer, FaDownload } from "react-icons/fa6";
import { SlGraph } from "react-icons/sl";
import { IoMdClose } from "react-icons/io";
import { MODES } from "@/types";
import { useLazyGetVisualizationQuery } from "@/store/api";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  frameActionIndexSelector,
  isAnimationModeEnabledSelector,
  setFrameActionIndex,
  setMode,
  setVisualization,
  visualizationSelector,
} from "@/store/visualization";
import {
  actualizeNodesPositions,
  graphEdgesSelector,
  graphNodesSelector,
} from "@/store/graph";

const buttons = [
  { children: <FaArrowPointer />, mode: MODES.DEFAULT },
  { children: <FaRegCircle />, mode: MODES.NODE },
  { children: <SlGraph />, mode: MODES.EDGE },
  { children: <FaRandom /> },
  { children: <FaDownload /> },
];

export const Toolbar: FC = () => {
  const isAnimationModeEnabled = useAppSelector(isAnimationModeEnabledSelector);
  const graphNodes = useAppSelector(graphNodesSelector);
  const graphEdges = useAppSelector(graphEdgesSelector);
  const [getVisualization, { isLoading }] = useLazyGetVisualizationQuery();

  const dispatch = useAppDispatch();

  const [selectedAlgorithm, selectAlgorithm] = useState("ford-fullkerson");
  const startVisualization = () => {
    try {
      getVisualization({
        algorithm: selectedAlgorithm,
        nodes: graphNodes,
        edges: graphEdges,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const leaveAnimationMode = () => {
    dispatch(actualizeNodesPositions());
    dispatch(setFrameActionIndex(0));
    dispatch(setMode(false));
    dispatch(setVisualization({ flow: 0, visualization: [] }));
  };

  const frameAnimationIndex = useAppSelector(frameActionIndexSelector);
  const visualization = useAppSelector(visualizationSelector);

  const handleBackwardAnimation = () =>
    dispatch(setFrameActionIndex(Math.max(frameAnimationIndex - 1, 0)));
  const handleForwardAnimation = () =>
    dispatch(
      setFrameActionIndex(
        Math.min(frameAnimationIndex + 1, visualization.visualization.length)
      )
    );

  return (
    <>
      {!isAnimationModeEnabled && (
        <div className="flex flex-col gap-2 absolute bottom-0 right-0 p-8 ">
          {buttons.map((buttonProps, index) => (
            <ToolbarButton {...buttonProps} key={index} disabled={isLoading} />
          ))}
        </div>
      )}
      <div className="flex gap-4 absolute bottom-0 items-center justify-center py-8 z-1 w-screen">
        {!isAnimationModeEnabled && (
          <ToolbarButton disabled={isLoading} onClick={startVisualization}>
            <FaPlay />
          </ToolbarButton>
        )}
        {!isAnimationModeEnabled && !isLoading && (
          <select
            value={selectedAlgorithm}
            onChange={(event) => selectAlgorithm(event.target.value)}
            className="bg-white py-2 border-1 rounded-lg"
          >
            <option value="ford-fullkerson">Ford-Fulkerson Algorithm</option>
            <option value="edmonds-karp">Edmonds-Karp Algorithm</option>
            <option value="dinic">Dinic&apos;s Algorithm</option>
          </select>
        )}
        {isAnimationModeEnabled && (
          <>
            <ToolbarButton onClick={handleBackwardAnimation}>
              <FaBackward />
            </ToolbarButton>
            <div className="h-10 w-[50%] bg-gray-200">
              <div
                className="h-full  bg-green-300 rounded-lg"
                style={{
                  width: `${
                    ((frameAnimationIndex + 1) /
                      visualization.visualization.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <ToolbarButton onClick={handleForwardAnimation}>
              <FaForward />
            </ToolbarButton>
          </>
        )}
        {isAnimationModeEnabled && (
          <ToolbarButton disabled={isLoading} onClick={leaveAnimationMode}>
            <IoMdClose />
          </ToolbarButton>
        )}
      </div>
    </>
  );
};
