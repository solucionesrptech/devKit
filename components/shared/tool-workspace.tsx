import * as React from "react";

import { cn } from "@/lib/utils";

type ToolWorkspaceProps = {
  form: React.ReactNode;
  preview: React.ReactNode;
  className?: string;
};

function ToolWorkspace({ form, preview, className }: ToolWorkspaceProps) {
  return (
    <div
      className={cn(
        "grid gap-6 lg:grid-cols-2 lg:items-start",
        className,
      )}
    >
      <div className="min-w-0">{form}</div>
      <div className="min-w-0 lg:sticky lg:top-20">{preview}</div>
    </div>
  );
}

export { ToolWorkspace };
