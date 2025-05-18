import { FC } from "react";
import { ToolbarButton } from "@/components/ToolbarButton";
import { FaRegCircle, FaRandom } from "react-icons/fa";
import { FaArrowPointer, FaDownload } from "react-icons/fa6";
import { SlGraph } from "react-icons/sl";
import { MODES } from "@/types";

const buttons = [
  { children: <FaArrowPointer />, mode: MODES.DEFAULT },
  { children: <FaRegCircle />, mode: MODES.NODE },
  { children: <SlGraph />, mode: MODES.EDGE },
  { children: <FaRandom /> },
  { children: <FaDownload /> },
];

export const Toolbar: FC = () => {
  return (
    <div className="flex flex-col gap-2 absolute bottom-0 right-0  p-8 bg-red">
      {buttons.map((buttonProps, index) => (
        <ToolbarButton {...buttonProps} key={index} />
      ))}
    </div>
  );
};
