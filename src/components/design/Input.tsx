import type { NextComponentType, NextPageContext } from "next";

type Props = {
  placeholder?: string;
};
export const Input: NextComponentType<NextPageContext, Props, Props> = ({
  placeholder,
}: Props) => {
  return (
    <input
      placeholder={placeholder}
      className="block  w-full rounded-lg border border-secondary-200 bg-transparent p-2.5 text-sm text-secondary-200 placeholder-secondary-400 focus:border-yellow-500 focus:ring-yellow-500"
    />
  );
};
