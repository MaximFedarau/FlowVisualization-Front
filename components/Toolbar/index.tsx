import { FC } from "react";
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
  setMode,
  setVisualization,
} from "@/store/visualization";
import { graphEdgesSelector, graphNodesSelector } from "@/store/graph";

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

  const check = async () => {
    console.log(graphEdges);
    const data = await getVisualization({
      algorithm: "dinic",
      nodes: graphNodes,
      edges: graphEdges,
    }).unwrap();
    console.log(data);
  };

  const leaveAnimationMode = () => {
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
      <div className="flex gap-4 absolute bottom-0 left-[50%] py-8 z-100">
        <ToolbarButton disabled={isLoading}>
          <FaPlay onClick={check} />
        </ToolbarButton>
        {isAnimationModeEnabled && (
          <ToolbarButton disabled={isLoading}>
            <IoMdClose onClick={leaveAnimationMode} />
          </ToolbarButton>
        )}
      </div>
    </>
  );
};
