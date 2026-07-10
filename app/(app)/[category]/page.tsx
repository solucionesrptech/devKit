import { notFound } from "next/navigation";

import { ToolCard } from "@/components/dashboard/module-card";
import { Badge } from "@/components/ui/badge";
import { getModuleById, statusLabels } from "@/lib/config/modules";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const module = getModuleById(category);

  if (!module) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <section className="animate-fade-in space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rubrika-primary/10">
            <module.icon className="h-6 w-6 text-rubrika-primary" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {module.name}
              </h1>
              <Badge
                variant={
                  module.status === "available"
                    ? "success"
                    : module.status === "beta"
                      ? "warning"
                      : "secondary"
                }
              >
                {statusLabels[module.status]}
              </Badge>
            </div>
            <p className="max-w-2xl text-muted">{module.description}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">
          Herramientas disponibles
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {module.tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  const { modules } = await import("@/lib/config/modules");
  return modules.map((module) => ({ category: module.id }));
}
