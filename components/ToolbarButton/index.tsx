import { FC, ReactNode, Key } from "react";

interface Props {
  children: ReactNode;
  key: Key;
}

export const ToolbarButton: FC<Props> = ({ children }) => {
  return (
    <button className="bg-white p-3 rounded-full pointer-events-auto hover:shadow-md cursor-pointer active:opacity-68">
      {children}
    </button>
  );
};
