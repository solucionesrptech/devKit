"use client";

import {
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppLogo } from "@/components/shared/app-logo";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navigation } from "@/lib/config/modules";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/providers/sidebar-provider";

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
        <div
          className={cn(
            "flex h-16 items-center border-b border-border px-4",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed && (
            <Link href="/" className="flex min-w-0 items-center gap-2.5">
              <AppLogo />
              <span className="truncate text-xs font-semibold text-muted">
                DevKit
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" aria-label="Rubrika DevKit" className="shrink-0">
              <div className="flex h-8 w-8 items-center overflow-hidden rounded-lg">
                <AppLogo alt="" variant="mark" />
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="hidden lg:flex shrink-0"
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden shrink-0"
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 scrollbar-thin">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const link = (
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-[var(--sidebar-active)] text-rubrika-primary"
                      : "text-muted hover:bg-[var(--sidebar-hover)] hover:text-foreground",
                    collapsed && "justify-center px-2",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active ? "text-rubrika-primary" : "text-muted",
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );

              if (collapsed) {
                return (
                  <li key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">{item.name}</TooltipContent>
                    </Tooltip>
                  </li>
                );
              }

              return <li key={item.id}>{link}</li>;
            })}
          </ul>
        </nav>

        {!collapsed && (
          <div className="border-t border-border p-4">
            <div className="rounded-lg bg-rubrika-primary/10 p-3">
              <p className="text-xs font-medium text-rubrika-primary">
                Rubrika DevKit
              </p>
              <p className="mt-1 text-xs text-muted">
                Suite interna de herramientas para desarrolladores.
              </p>
            </div>
          </div>
        )}
    </div>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar overlay"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out lg:static lg:translate-x-0",
          collapsed ? "w-[68px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

export function SidebarMobileTrigger() {
  const { setMobileOpen } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={() => setMobileOpen(true)}
      aria-label="Abrir menú"
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
}

export function SidebarCollapseHint() {
  const { collapsed } = useSidebar();
  if (!collapsed) return null;
  return <ChevronLeft className="h-3 w-3 text-muted" aria-hidden />;
}
