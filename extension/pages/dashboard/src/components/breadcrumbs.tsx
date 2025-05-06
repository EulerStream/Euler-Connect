import type { BreadcrumbData } from "use-react-router-breadcrumbs";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { ChevronRight } from "lucide-react";
import { cn, getPath } from "@src/lib/utils";
import type { ComponentProps } from "react";

function getQualifiedName(breadcrumb: string) {
  return breadcrumb
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function getTitle(breadcrumb: string) {
  if (breadcrumb === "/") {
    return "Euler Connect";
  }

  const basePath = breadcrumb.split("/").pop()!;
  return "Euler Connect | " + getQualifiedName(basePath);
}

export const Breadcrumbs = (props: ComponentProps<"div">) => {
  const breadcrumbData: BreadcrumbData[] = useBreadcrumbs();
  const breadCrumbElements = [];
  document.title = getTitle(
    breadcrumbData[breadcrumbData.length - 1].location.pathname,
  );

  for (let idx = 0; idx < breadcrumbData.length; idx++) {
    const data = breadcrumbData[idx];

    breadCrumbElements.push(
      <a
        className={"text-base"}
        key={data.key}
        href={
          idx === breadcrumbData.length - 1
            ? window.location.href
            : getPath(data.match.pathname)
        }
      >
        {getQualifiedName(data.match.pathname.split("/").pop()! || "Home")}
      </a>,
    );

    if (idx !== breadcrumbData.length - 1) {
      breadCrumbElements.push(
        <div key={data.key + "_separator"} className={"mt-0.5"}>
          <ChevronRight width={14} strokeWidth={3} />
        </div>,
      );
    }
  }

  if (breadCrumbElements.length === 1) {
    return <div />;
  }

  const { className, ...rest } = props;

  return (
    <div {...rest} className={cn("flex gap-x-1 items-center", className || {})}>
      {breadCrumbElements}
    </div>
  );
};
