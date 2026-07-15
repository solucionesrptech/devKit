import { Badge } from "@/components/ui/badge";
import { statusLabels, type Tool, type ToolStatus } from "@/lib/config/modules";

type ToolPageHeaderProps = {
  tool: Tool;
  description?: string;
};

function getStatusVariant(status: ToolStatus) {
  if (status === "available") return "success" as const;
  if (status === "beta") return "warning" as const;
  return "secondary" as const;
}

function ToolPageHeader({ tool, description }: ToolPageHeaderProps) {
  const Icon = tool.icon;
  const copy = description ?? tool.description;

  return (
    <header className="animate-fade-in space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-devkit-primary/10">
          <Icon className="h-5 w-5 text-devkit-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {tool.name}
        </h1>
        <Badge variant={getStatusVariant(tool.status)}>
          {statusLabels[tool.status]}
        </Badge>
      </div>
      <p className="max-w-3xl text-muted">{copy}</p>
    </header>
  );
}

export { ToolPageHeader };
