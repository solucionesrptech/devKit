import { ArrowRight, Star, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  type Module,
  statusLabels,
  type Tool,
  type ToolStatus,
} from "@/lib/config/modules";
import { cn } from "@/lib/utils";

function statusVariant(status: ToolStatus) {
  switch (status) {
    case "available":
      return "success" as const;
    case "beta":
      return "warning" as const;
    case "coming-soon":
      return "secondary" as const;
  }
}

type ModuleCardProps = {
  module: Module;
  className?: string;
};

export function ModuleCard({ module, className }: ModuleCardProps) {
  const disabled = module.status === "coming-soon";

  return (
    <Link
      href={disabled ? "#" : module.href}
      className={cn(
        "group block animate-fade-in",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
      aria-disabled={disabled}
    >
      <Card className="h-full transition-all duration-200 hover:border-rubrika-primary/30 hover:bg-card-hover hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5">
        <CardContent className="flex h-full flex-col gap-5 p-6">
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rubrika-primary/10 transition-colors duration-200 group-hover:bg-rubrika-primary/20">
              <module.icon className="h-5 w-5 text-rubrika-primary" />
            </div>
            <Badge variant={statusVariant(module.status)}>
              {statusLabels[module.status]}
            </Badge>
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold tracking-tight">{module.name}</h3>
            <p className="text-sm leading-relaxed text-muted">{module.description}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-medium text-muted-foreground">
              {module.toolCount}{" "}
              {module.toolCount === 1 ? "herramienta" : "herramientas"}
            </span>
            {!disabled && (
              <ArrowRight className="h-4 w-4 text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-rubrika-primary" />
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

type ToolCardProps = {
  tool: Tool;
  compact?: boolean;
};

export function ToolCard({ tool, compact = false }: ToolCardProps) {
  const disabled = tool.status === "coming-soon";

  return (
    <Link
      href={disabled ? "#" : tool.href}
      className={cn(
        "group block",
        disabled && "pointer-events-none opacity-60",
      )}
      aria-disabled={disabled}
    >
      <Card
        className={cn(
          "transition-all duration-200 hover:border-rubrika-primary/30 hover:bg-card-hover",
          compact ? "hover:shadow-none" : "hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5",
        )}
      >
        <CardContent className={cn("flex items-center gap-4", compact ? "p-4" : "p-5")}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rubrika-primary/10">
            <tool.icon className="h-4 w-4 text-rubrika-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium">{tool.name}</p>
              {!compact && (
                <Badge variant={statusVariant(tool.status)} className="shrink-0">
                  {statusLabels[tool.status]}
                </Badge>
              )}
            </div>
            {!compact && (
              <p className="mt-0.5 truncate text-sm text-muted">{tool.description}</p>
            )}
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-rubrika-primary" />
        </CardContent>
      </Card>
    </Link>
  );
}

type QuickAccessProps = {
  items: { label: string; href: string; icon: LucideIcon }[];
};

export function QuickAccess({ items }: QuickAccessProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition-all duration-200 hover:border-rubrika-primary/30 hover:bg-card-hover"
        >
          <item.icon className="h-3.5 w-3.5 text-rubrika-primary" />
          {item.label}
        </Link>
      ))}
    </div>
  );
}

type RecentListProps = {
  items: { tool: Tool; usedAt: string }[];
};

export function RecentList({ items }: RecentListProps) {
  return (
    <div className="space-y-2">
      {items.map(({ tool, usedAt }) => (
        <Link
          key={tool.id}
          href={tool.href}
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-white/[0.03]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-input">
            <tool.icon className="h-3.5 w-3.5 text-muted group-hover:text-rubrika-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{tool.name}</p>
            <p className="text-xs text-muted-foreground">{usedAt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

type FavoritesListProps = {
  tools: Tool[];
};

export function FavoritesList({ tools }: FavoritesListProps) {
  return (
    <div className="space-y-2">
      {tools.map((tool) => (
        <Link
          key={tool.id}
          href={tool.href}
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-white/[0.03]"
        >
          <Star className="h-3.5 w-3.5 shrink-0 fill-rubrika-accent text-rubrika-accent" />
          <span className="truncate text-sm font-medium">{tool.name}</span>
        </Link>
      ))}
    </div>
  );
}
