import {
  favorites,
  modules,
  mostUsedTools,
  quickAccess,
  recentHistory,
} from "@/lib/config/modules";
import {
  FavoritesList,
  ModuleCard,
  QuickAccess,
  RecentList,
  ToolCard,
} from "@/components/dashboard/module-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 p-4 sm:p-6 lg:p-8">
      <section className="animate-fade-in space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="max-w-2xl text-muted">
          Tu centro de productividad. Accede rápido a las herramientas que usas
          todos los días.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="animate-fade-in stagger-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Accesos rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickAccess items={quickAccess} />
          </CardContent>
        </Card>

        <Card className="animate-fade-in stagger-2">
          <CardHeader>
            <CardTitle className="text-base">Favoritos</CardTitle>
          </CardHeader>
          <CardContent>
            <FavoritesList tools={favorites} />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Herramientas más utilizadas
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {mostUsedTools.map((tool, i) => (
            <div
              key={tool.id}
              className={`animate-fade-in stagger-${Math.min(i + 1, 6)}`}
            >
              <ToolCard tool={tool} compact />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="animate-fade-in stagger-3 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Historial reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentList items={recentHistory} />
          </CardContent>
        </Card>

        <Card className="animate-fade-in stagger-4">
          <CardHeader>
            <CardTitle className="text-base">Últimas herramientas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentHistory.slice(0, 3).map(({ tool }) => (
              <ToolCard key={tool.id} tool={tool} compact />
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Módulos</h2>
          <p className="mt-1 text-sm text-muted">
            Explora todas las herramientas disponibles por categoría.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module, i) => (
            <ModuleCard
              key={module.id}
              module={module}
              className={`stagger-${Math.min(i + 1, 6)}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
