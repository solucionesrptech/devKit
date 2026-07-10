import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 sm:p-6 lg:p-8">
      <section className="animate-fade-in space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Settings
        </h1>
        <p className="text-muted">
          Configura tu experiencia en Devkit.
        </p>
      </section>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Apariencia</TabsTrigger>
          <TabsTrigger value="shortcuts">Atajos</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferencias generales</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              Configuración de cuenta y preferencias de la suite de herramientas.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Apariencia</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              El tema se controla desde el selector en el header. Oscuro por
              defecto para sesiones largas de trabajo.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shortcuts">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Atajos de teclado</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Command Palette</dt>
                  <dd>
                    <kbd className="rounded border border-border bg-input px-2 py-0.5 font-mono text-xs">
                      ⌘ K
                    </kbd>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
