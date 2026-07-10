"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  text: string | null;
  disabled?: boolean;
  label?: string;
  successMessage?: string;
  className?: string;
  variant?: ButtonProps["variant"];
};

function CopyButton({
  text,
  disabled,
  label = "Copiar SQL",
  successMessage = "SQL copiado al portapapeles",
  className,
  variant = "default",
}: CopyButtonProps) {
  const handleCopy = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
    } catch {
      toast.error("No se pudo copiar al portapapeles.");
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      onClick={handleCopy}
      disabled={disabled || !text}
      className={cn(className)}
    >
      <Copy className="h-4 w-4" />
      {label}
    </Button>
  );
}

export { CopyButton };
