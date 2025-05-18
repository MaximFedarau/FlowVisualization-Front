import { FC, ReactNode } from "react";

interface Props {
  title: string;
  children?: ReactNode;
  onClose: () => void;
  onAgree: () => void;
  onDisagree: () => void;
}

export const Dialog: FC<Props> = ({
  title,
  children,
  onClose,
  onAgree,
  onDisagree,
}) => {
  return (
    <div
      onClick={onClose}
      className="bg-black/50 z-2 h-screen w-screen top-0 fixed flex items-center justify-center"
    >
      <div
        className="flex flex-col bg-white w-[36vw] p-12 rounded-lg gap-12"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex flex-col gap-8">
          <p className="text-xl font-semibold">{title}</p>
          {Boolean(children) && children}
        </header>
        <div className="flex gap-4">
          <button
            className="h-14 w-24 rounded-lg px-5 text-sm font-medium text-center border-none cursor-pointer bg-green-300 hover:opacity-90"
            onClick={onAgree}
          >
            Confirm
          </button>
          <button
            onClick={onDisagree}
            className="h-14 w-24 rounded-lg px-5 text-sm font-medium text-center border-none cursor-pointer bg-red-300 hover:opacity-90"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
