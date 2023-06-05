import { noop } from "lodash";
import type { NextComponentType, NextPageContext } from "next";

type Props = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};
export const Input: NextComponentType<NextPageContext, Props, Props> = ({
  placeholder,
  onChange,
  value,
  disabled,
}: Props) => {
  return (
    <input
      placeholder={placeholder}
      value={value}
      disabled={!!disabled}
      onChange={(e) => (onChange ? onChange(e.target.value) : noop)}
      className="block  w-full rounded-lg border border-secondary-200 bg-transparent p-2.5 text-sm text-secondary-200 placeholder-secondary-400 focus:border-yellow-500 focus:ring-yellow-500"
    />
  );
};
