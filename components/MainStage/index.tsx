import {
  FC,
  useState,
  useEffect,
  useRef,
  Ref,
  useCallback,
  useMemo,
} from "react";
import { MODES } from "@/types";
import { Stage } from "react-konva";
import { Grid } from "@/components/Grid";
import { KonvaEventObject } from "konva/lib/Node";
import { MainScene } from "../MainScene";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { addNode, graphModeSelector, setMode } from "@/store/graph";
import { createPortal } from "react-dom";
import { Dialog } from "@/components/Dialog";

export const MainStage: FC = () => {
  const [newEdgeSelectedNodes, setNewEdgeSelectedNodes] = useState<number[]>(
    []
  );
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const stageWidth = useMemo(() => (global.window ? window.innerWidth : 0), []);
  const stageHeight = useMemo(
    () => (global.window ? window.innerHeight : 0),
    []
  );

  const [globalSizes, setGlobalSizes] = useState({
    width: stageWidth,
    height: stageHeight,
  });
  const [stageSize, setStageSize] = useState({
    width: stageWidth,
    height: stageHeight,
    scale: 1,
  });

  const containerRef: Ref<HTMLDivElement> = useRef(null);

  const updateLayoutOnResize = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const scale = containerWidth / stageWidth;
    setStageSize({
      width: stageWidth * scale,
      height: stageHeight * scale,
      scale: scale,
    });
    setGlobalSizes({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, [stageHeight, stageWidth]);

  useEffect(() => {
    updateLayoutOnResize();
    window.addEventListener("resize", updateLayoutOnResize);
    return () => window.removeEventListener("resize", updateLayoutOnResize);
  }, [updateLayoutOnResize]);

  const graphMode = useAppSelector(graphModeSelector);
  const dispatch = useAppDispatch();

  const handleClick = ({ evt }: KonvaEventObject<MouseEvent>) => {
    if (graphMode === MODES.NODE) {
      dispatch(
        addNode({
          x: evt.clientX / stageSize.scale,
          y: evt.clientY / stageSize.scale,
        })
      );
    }

    if (graphMode === MODES.EDGE) {
      setNewEdgeSelectedNodes([]);
      dispatch(setMode(MODES.DEFAULT));
    }
  };

  const openDialog = () => setIsOpenDialog(true);
  const closeDialog = () => {
    setIsOpenDialog(false);
    setNewEdgeSelectedNodes([]);
  };

  return (
    <div ref={containerRef} className="w-full h-full">
      <Stage
        width={globalSizes.width}
        height={globalSizes.height}
        onClick={handleClick}
      >
        <Grid />
        <MainScene
          newEdgeSelectedNodesIds={newEdgeSelectedNodes}
          selectNewEdgeNodes={setNewEdgeSelectedNodes}
          openNewEdgeDialog={openDialog}
          {...stageSize}
        />
      </Stage>
      {isOpenDialog &&
        createPortal(
          <Dialog
            title="Create new edge?"
            onClose={closeDialog}
            onAgree={() => console.log(2)}
            onDisagree={closeDialog}
          >
            <p>Select settings</p>
          </Dialog>,
          document.getElementById("modal-root")!
        )}
    </div>
  );
};
