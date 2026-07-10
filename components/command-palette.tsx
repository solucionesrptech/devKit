"use client";

import { Command } from "cmdk";
import {
  ArrowRight,
  FileSpreadsheet,
  LayoutDashboard,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { modules, tools } from "@/lib/config/modules";
import { cn } from "@/lib/utils";

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="overflow-hidden p-0 max-w-xl"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogTitle className="sr-only">Buscar herramientas</DialogTitle>
        <DialogDescription className="sr-only">
          Busca módulos y herramientas de Devkit.
        </DialogDescription>
        <Command
          className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2.5"
          loop
        >
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted" />
            <Command.Input
              placeholder="Buscar herramientas, módulos o acciones..."
              className="flex h-12 w-full rounded-lg bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
            <Command.Empty className="py-6 text-center text-sm text-muted">
              No se encontraron resultados.
            </Command.Empty>

            <Command.Group heading="Accesos rápidos">
              <Command.Item
                onSelect={() => runCommand(() => router.push("/"))}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg aria-selected:bg-white/5",
                )}
              >
                <LayoutDashboard className="h-4 w-4 text-rubrika-primary" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() =>
                  runCommand(() => router.push("/tools/sql-generator"))
                }
                className="flex cursor-pointer items-center gap-3 rounded-lg aria-selected:bg-white/5"
              >
                <Sparkles className="h-4 w-4 text-rubrika-accent" />
                <span>SQL Generator</span>
              </Command.Item>
              <Command.Item
                onSelect={() =>
                  runCommand(() => router.push("/tools/excel-to-sql"))
                }
                className="flex cursor-pointer items-center gap-3 rounded-lg aria-selected:bg-white/5"
              >
                <FileSpreadsheet className="h-4 w-4 text-rubrika-primary" />
                <span>Excel → SQL</span>
              </Command.Item>
              <Command.Item
                onSelect={() =>
                  runCommand(() => router.push("/tools/sql-formatter"))
                }
                className="flex cursor-pointer items-center gap-3 rounded-lg aria-selected:bg-white/5"
              >
                <Wrench className="h-4 w-4 text-muted" />
                <span>SQL Formatter</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Módulos">
              {modules.map((module) => (
                <Command.Item
                  key={module.id}
                  onSelect={() => runCommand(() => router.push(module.href))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg aria-selected:bg-white/5"
                >
                  <module.icon className="h-4 w-4 text-rubrika-primary" />
                  <div className="flex flex-1 flex-col">
                    <span>{module.name}</span>
                    <span className="text-xs text-muted">{module.description}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted" />
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Herramientas">
              {tools.map((tool) => (
                <Command.Item
                  key={tool.id}
                  onSelect={() => runCommand(() => router.push(tool.href))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg aria-selected:bg-white/5"
                >
                  <tool.icon className="h-4 w-4 text-muted" />
                  <span>{tool.name}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted">
            <span>Navega con ↑ ↓</span>
            <div className="flex items-center gap-2">
              <kbd className="rounded border border-border bg-input px-1.5 py-0.5 font-mono text-[10px]">
                ↵
              </kbd>
              <span>seleccionar</span>
              <kbd className="rounded border border-border bg-input px-1.5 py-0.5 font-mono text-[10px]">
                esc
              </kbd>
              <span>cerrar</span>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export function CommandPaletteTrigger({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-10 w-full max-w-md items-center gap-2 rounded-lg border border-border bg-input px-3 text-sm text-muted transition-colors duration-200 hover:border-rubrika-primary/30 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left">Buscar herramientas...</span>
      <kbd className="hidden rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
        ⌘K
      </kbd>
    </button>
  );
}
