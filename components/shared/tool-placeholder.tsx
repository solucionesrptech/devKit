import type { Tool } from "@/lib/config/modules";

type ToolPlaceholderProps = {
  tool: Tool;
};

function ToolPlaceholder({ tool }: ToolPlaceholderProps) {
  if (tool.status === "coming-soon") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-lg font-medium">Próximamente</p>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Esta herramienta está en desarrollo. Vuelve pronto para acceder a{" "}
          {tool.name}.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
      <p className="text-lg font-medium">Listo para implementar</p>
      <p className="mt-2 max-w-sm text-sm text-muted">
        La interfaz de {tool.name} se conectará aquí. La arquitectura de rutas
        ya está preparada para escalar sin modificar el layout principal.
      </p>
    </div>
  );
}

export { ToolPlaceholder };
