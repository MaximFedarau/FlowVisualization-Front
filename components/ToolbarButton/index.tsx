import { useAppDispatch, useAppSelector } from "@/hooks";
import { graphModeSelector, setMode } from "@/store/graph";
import { MODES } from "@/types";
import { FC, ReactNode, Key } from "react";

interface Props {
  children: ReactNode;
  key: Key;
  mode?: MODES;
  onClick?: () => void;
}

export const ToolbarButton: FC<Props> = ({ children, mode }) => {
  const graphMode = useAppSelector(graphModeSelector);

  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setMode(mode || MODES.DEFAULT));
  };

  return (
    <button
      className={`${
        graphMode === mode ? "bg-gray-200" : "bg-white"
      } p-3 border-solid ${
        graphMode === mode ? "border-1" : "border-hidden"
      } rounded-full pointer-events-auto hover:shadow-md cursor-pointer active:opacity-68`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
