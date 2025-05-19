import { FC, useState } from "react";
import { ToolbarButton } from "@/components/ToolbarButton";
import { FaRegCircle, FaRandom, FaPlay } from "react-icons/fa";
import { FaArrowPointer, FaDownload } from "react-icons/fa6";
import { SlGraph } from "react-icons/sl";
import { IoMdClose } from "react-icons/io";
import { MODES } from "@/types";
import { useLazyGetVisualizationQuery } from "@/store/api";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  isAnimationModeEnabledSelector,
  setFrameActionIndex,
  setMode,
  setVisualization,
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
  const [getVisualization, { isLoading, isSuccess }] =
    useLazyGetVisualizationQuery();

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

  return (
    <>
      {!isAnimationModeEnabled && (
        <div className="flex flex-col gap-2 absolute bottom-0 right-0 p-8 ">
          {buttons.map((buttonProps, index) => (
            <ToolbarButton {...buttonProps} key={index} disabled={isLoading} />
          ))}
        </div>
      )}
      <div className="flex gap-4 absolute bottom-0 items-center justify-center py-8 z-100 w-screen">
        {!isAnimationModeEnabled && (
          <ToolbarButton disabled={isLoading}>
            <FaPlay onClick={startVisualization} />
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
          <ToolbarButton disabled={isLoading}>
            <IoMdClose onClick={leaveAnimationMode} />
          </ToolbarButton>
        )}
      </div>
    </>
  );
};
