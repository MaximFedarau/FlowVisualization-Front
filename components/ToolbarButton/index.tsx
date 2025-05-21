import { useAppDispatch, useAppSelector } from "@/hooks";
import { clearNewEdgeNodes, graphModeSelector, setMode } from "@/store/graph";
import { MODES } from "@/types";
import { FC, ReactNode, Key } from "react";

interface Props {
  children: ReactNode;
  disabled?: boolean;
  key?: Key;
  mode?: MODES;
  onClick?: () => void;
}

export const ToolbarButton: FC<Props> = ({
  children,
  mode,
  disabled,
  onClick,
}) => {
  const graphMode = useAppSelector(graphModeSelector);

  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    dispatch(clearNewEdgeNodes());
    dispatch(setMode(mode || MODES.DEFAULT));
  };

  return (
    <button
      className={`${
        graphMode === mode ? "bg-gray-200" : "bg-white"
      } p-3 border-solid ${
        graphMode === mode ? "border-1" : "border-hidden"
      } rounded-full pointer-events-auto hover:shadow-md cursor-pointer active:opacity-68 disabled:opacity-30`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
