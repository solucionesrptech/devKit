import { AppShell } from "@/components/layout/app-shell";
import { ClientToaster } from "@/components/client-toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/theme-provider";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <AppShell>{children}</AppShell>
        <ClientToaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
