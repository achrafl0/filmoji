import type { NextComponentType, NextPageContext } from "next";

type Props = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
};
export const Button: NextComponentType<NextPageContext, Props, Props> = ({
  text,
  onClick,
  disabled,
}: Props) => {
  return (
    <button
      disabled={!!disabled}
      className="rounded bg-primary-500 px-4 py-2 font-semibold text-gray-800 shadow hover:bg-primary-600"
      onClick={onClick}
    >
      {text}
    </button>
  );
};
