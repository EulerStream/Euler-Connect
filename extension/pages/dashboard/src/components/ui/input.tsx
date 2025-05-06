import type * as React from "react";

import { cn } from "@src/lib/utils";
import { Checkbox } from "@src/components/ui/checkbox";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

interface InputWithTextProps extends React.ComponentProps<typeof Input> {
  text: string;
  subtext?: string;
  containerProps?: React.ComponentProps<"div">;
  siblings?: React.ReactNode;
}

function InputWithText({
  text,
  subtext,
  containerProps,
  siblings,
  ...props
}: InputWithTextProps) {
  const { className, ...restContainerProps } = containerProps || {};

  return (
    <div
      {...restContainerProps}
      className={cn("items-top flex flex-col space-x-2", className)}
    >
      <label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {text}
      </label>
      {subtext && (
        <p className="text-sm text-muted-foreground mb-2">{subtext}</p>
      )}
      <div className={"flex gap-x-4"}>
        <Input {...props} />
        {siblings}
      </div>
    </div>
  );
}

export { Input, InputWithText };
