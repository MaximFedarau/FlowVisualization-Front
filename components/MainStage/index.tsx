import {
  FC,
  useState,
  useEffect,
  useRef,
  Ref,
  useCallback,
  useMemo,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { MODES } from "@/types";
import { Stage } from "react-konva";
import { Grid } from "@/components/Grid";
import { KonvaEventObject } from "konva/lib/Node";
import { MainScene } from "../MainScene";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  addEdge,
  addNode,
  clearNewEdgeNodes,
  graphModeSelector,
  newEdgeNodesSelector,
  setMode,
} from "@/store/graph";
import { createPortal } from "react-dom";
import { Dialog } from "@/components/Dialog";

export const MainStage: FC = () => {
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
      dispatch(clearNewEdgeNodes());
      dispatch(setMode(MODES.DEFAULT));
    }
  };

  const [capacityValue, setCapacityValue] = useState<string>("");

  const openDialog = () => setIsOpenDialog(true);
  const closeDialog = () => {
    setIsOpenDialog(false);
    setCapacityValue("");
    dispatch(clearNewEdgeNodes());
  };

  const validateCapacityInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key.length === 1 && !/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const updateCapacityInputValue = (event: ChangeEvent<HTMLInputElement>) => {
    setCapacityValue(event.target.value);
  };

  const newEdgeNodes = useAppSelector(newEdgeNodesSelector);

  const createNewEdge = () => {
    if (isNaN(parseInt(capacityValue))) {
      closeDialog();
      return;
    }
    dispatch(
      addEdge({
        from_id: newEdgeNodes[0],
        to_id: newEdgeNodes[1],
        capacity: parseInt(capacityValue),
      })
    );
    closeDialog();
  };

  return (
    <div ref={containerRef} className="w-full h-full">
      <Stage
        width={globalSizes.width}
        height={globalSizes.height}
        onClick={handleClick}
      >
        <Grid />
        <MainScene openNewEdgeDialog={openDialog} {...stageSize} />
      </Stage>
      {isOpenDialog &&
        createPortal(
          <Dialog
            title="Create new edge?"
            onClose={closeDialog}
            onAgree={createNewEdge}
            onDisagree={closeDialog}
          >
            <input
              className="border-1 h-10 px-2 rounded-lg"
              placeholder="Select capacity"
              onKeyDown={validateCapacityInput}
              value={capacityValue}
              onChange={updateCapacityInputValue}
            />
          </Dialog>,
          document.getElementById("modal-root")!
        )}
    </div>
  );
};
