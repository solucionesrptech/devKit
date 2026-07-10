import * as React from "react";

import { cn } from "@/lib/utils";

type ToolLayoutWidth = "default" | "wide" | "full";

const widthClasses: Record<ToolLayoutWidth, string> = {
  default: "max-w-5xl",
  wide: "max-w-7xl",
  full: "max-w-[1600px]",
};

type ToolPageLayoutProps = {
  children: React.ReactNode;
  width?: ToolLayoutWidth;
  className?: string;
};

function ToolPageLayout({
  children,
  width = "default",
  className,
}: ToolPageLayoutProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full space-y-6 p-4 sm:p-6 lg:p-8",
        widthClasses[width],
        className,
      )}
    >
      {children}
    </div>
  );
}

export { ToolPageLayout, type ToolLayoutWidth };
