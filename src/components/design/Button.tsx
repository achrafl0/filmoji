import type { NextComponentType, NextPageContext } from "next";

type Props = {
  text: string;
  onClick?: () => void;
};
export const Button: NextComponentType<NextPageContext, Props, Props> = ({
  text,
  onClick,
}: Props) => {
  return (
    <button
      className="rounded bg-primary-500 px-4 py-2 font-semibold text-gray-800 shadow hover:bg-primary-600"
      onClick={onClick}
    >
      {text}
    </button>
  );
};
