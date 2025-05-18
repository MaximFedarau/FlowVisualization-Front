import { FC, useState, useEffect } from "react";
import { KonvaNode } from "@/types";
import { Stage } from "react-konva";
import { NodesScene } from "../NodesScene";

export const Scene: FC = () => {
  const [nodes, setNodes] = useState<KonvaNode[]>([]);
  const [windowSize, setWindowSize] = useState({
    width: global.window ? window.innerWidth : 0,
    height: global.window ? window.innerHeight : 0,
  });

  const updateWindowSizeOnResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    updateWindowSizeOnResize();
    window.addEventListener("resize", updateWindowSizeOnResize);
    return () => window.removeEventListener("resize", updateWindowSizeOnResize);
  }, []);

  return (
    <Stage
      width={windowSize.width}
      height={windowSize.height}
      onMouseDown={({ evt }) => {
        setNodes([...nodes, { x: evt.clientX, y: evt.clientY }]);
      }}
      style={{ backgroundColor: "lightblue" }}
    >
      <NodesScene nodes={nodes} />
    </Stage>
  );
};
