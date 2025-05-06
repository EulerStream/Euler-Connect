import type * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@src/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

interface CheckboxWithTextProps extends React.ComponentProps<typeof Checkbox> {
  text: string;
  subtext?: string;
  containerProps?: React.ComponentProps<"div">;
  onClick?: () => void;
}

function CheckboxWithText({
  text,
  subtext,
  containerProps,
  ...props
}: CheckboxWithTextProps) {
  const { className, ...restContainerProps } = containerProps || {};

  return (
    <div
      {...restContainerProps}
      className={cn("items-top flex space-x-2", className)}
    >
      <Checkbox {...props} />
      <div className="grid gap-1.5 leading-none select-none">
        <label
          onClick={props.onClick}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {text}
        </label>
        {subtext && (
          <p className="text-sm text-muted-foreground" onClick={props.onClick}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

export { Checkbox, CheckboxWithText };
