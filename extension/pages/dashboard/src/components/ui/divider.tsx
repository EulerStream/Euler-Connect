import type { HTMLProps } from "react";
import { cn } from "@src/lib/utils";

export default function Divider(props: HTMLProps<HTMLHRElement>) {
  const { className, ...rest } = props;

  return (
    <hr
      className={cn("bg-white border-0.5 bg-background my-6", className || "")}
      {...rest}
    />
  );
}
