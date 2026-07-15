import type { ComponentType } from "react";

import { ComparePage } from "@/features/compare-studio";
import { PdfBase64Page } from "@/features/pdf-base64";
import { SqlGeneratorPage } from "@/features/sql-generator";
import type { ToolLayoutWidth } from "@/components/shared/tool-page-layout";

export type ToolPageEntry = {
  Component: ComponentType;
  layoutWidth?: ToolLayoutWidth;
  description?: string;
};

export const toolPages: Record<string, ToolPageEntry> = {
  "sql-generator": {
    Component: SqlGeneratorPage,
    layoutWidth: "wide",
    description:
      "Genera consultas SELECT y UPDATE a partir de listas o Excel/CSV. DELETE físico disponible; para borrado lógico usa UPDATE.",
  },
  "compare-studio": {
    Component: ComparePage,
    layoutWidth: "full",
    description: "Compara listas, archivos y código de forma visual.",
  },
  "compare-lists": {
    Component: ComparePage,
    layoutWidth: "full",
    description: "Compara listas, archivos y código de forma visual.",
  },
  "pdf-base64": {
    Component: PdfBase64Page,
    layoutWidth: "wide",
    description:
      "Sube un PDF y obtén su representación Base64. Todo el proceso ocurre en tu navegador.",
  },
};

export function getToolPage(slug: string): ToolPageEntry | undefined {
  return toolPages[slug];
}
