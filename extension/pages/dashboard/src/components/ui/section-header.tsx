import type { ComponentProps } from "react";

interface ISectionHeaderProps extends ComponentProps<"div"> {
  header: string;
  description?: string;
}

export default function SectionHeader({
  header,
  description,
  ...props
}: ISectionHeaderProps) {
  return (
    <div {...props}>
      <h3 className={"text-xl font-bold"}>{header}</h3>
      <h4 className={"text-sm text-muted-fg"}>{description}</h4>
    </div>
  );
}
