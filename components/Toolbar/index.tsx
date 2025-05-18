import { FC } from "react";
import { ToolbarButton } from "@/components/ToolbarButton";
import { FaRegCircle, FaRandom } from "react-icons/fa";
import { FaArrowPointer, FaDownload } from "react-icons/fa6";
import { SlGraph } from "react-icons/sl";

const buttons = [
  { children: <FaArrowPointer /> },
  { children: <FaRegCircle /> },
  { children: <SlGraph /> },
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
