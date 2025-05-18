import {
  FC,
  useState,
  useEffect,
  useRef,
  Ref,
  useCallback,
  useMemo,
} from "react";
import { KonvaNode } from "@/types";
import { Stage } from "react-konva";
import { Grid } from "@/components/Grid";
import { KonvaEventObject } from "konva/lib/Node";
import { MainScene } from "../MainScene";

export const MainStage: FC = () => {
  const [nodes, setNodes] = useState<KonvaNode[]>([]);

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

  const addNodeOnClick = ({ evt }: KonvaEventObject<MouseEvent>) => {
    setNodes([
      ...nodes,
      {
        x: evt.clientX / stageSize.scale,
        y: evt.clientY / stageSize.scale,
      },
    ]);
  };

  return (
    <div ref={containerRef} className="w-full h-full">
      <Stage
        width={globalSizes.width}
        height={globalSizes.height}
        onMouseDown={addNodeOnClick}
      >
        <Grid />
        <MainScene nodes={nodes} {...stageSize} />
      </Stage>
    </div>
  );
};
