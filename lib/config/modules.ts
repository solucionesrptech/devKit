import {
  Bot,
  Braces,
  Database,
  FileSpreadsheet,
  GitCompare,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  Table2,
  Text,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type ToolStatus = "available" | "beta" | "coming-soon";

export type Tool = {
  id: string;
  name: string;
  description: string;
  href: string;
  status: ToolStatus;
  category: string;
  icon: LucideIcon;
};

export type Module = {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  toolCount: number;
  status: ToolStatus;
  tools: Tool[];
};

export const tools: Tool[] = [
  {
    id: "sql-generator",
    name: "SQL Generator",
    description: "Genera consultas SQL a partir de criterios estructurados.",
    href: "/tools/sql-generator",
    status: "available",
    category: "sql-tools",
    icon: Sparkles,
  },
  {
    id: "sql-formatter",
    name: "SQL Formatter",
    description: "Formatea y beautifica scripts SQL con un clic.",
    href: "/tools/sql-formatter",
    status: "available",
    category: "sql-tools",
    icon: Wrench,
  },
  {
    id: "search-stored-procedures",
    name: "Search Stored Procedures",
    description: "Busca y explora procedimientos almacenados en la base de datos.",
    href: "/tools/search-stored-procedures",
    status: "available",
    category: "sql-tools",
    icon: Search,
  },
  {
    id: "excel-to-sql",
    name: "Excel → SQL",
    description: "Convierte hojas de cálculo en sentencias INSERT o UPDATE.",
    href: "/tools/excel-to-sql",
    status: "available",
    category: "excel-tools",
    icon: FileSpreadsheet,
  },
  {
    id: "compare-studio",
    name: "Compare Studio",
    description:
      "Compara archivos, código, SQL, JSON, XML y listas sin salir del navegador.",
    href: "/tools/compare-studio",
    status: "available",
    category: "text-tools",
    icon: GitCompare,
  },
  {
    id: "json-xml-tools",
    name: "JSON/XML Tools",
    description: "Formatea, valida y transforma JSON y XML.",
    href: "/tools/json-xml-tools",
    status: "beta",
    category: "text-tools",
    icon: Braces,
  },
  {
    id: "database-explorer",
    name: "Database Explorer",
    description: "Explora esquemas, tablas e índices de forma visual.",
    href: "/tools/database-explorer",
    status: "beta",
    category: "database",
    icon: Table2,
  },
  {
    id: "ai-sql-assistant",
    name: "AI SQL Assistant",
    description: "Asistente inteligente para consultas y optimización SQL.",
    href: "/tools/ai-sql-assistant",
    status: "coming-soon",
    category: "ai-assistant",
    icon: Bot,
  },
];

export const modules: Module[] = [
  {
    id: "sql-tools",
    name: "SQL Tools",
    description: "Generación, formateo y búsqueda de consultas SQL.",
    href: "/sql-tools",
    icon: Sparkles,
    toolCount: 3,
    status: "available",
    tools: tools.filter((t) => t.category === "sql-tools"),
  },
  {
    id: "excel-tools",
    name: "Excel Tools",
    description: "Conversión y transformación de datos desde Excel.",
    href: "/excel-tools",
    icon: FileSpreadsheet,
    toolCount: 1,
    status: "available",
    tools: tools.filter((t) => t.category === "excel-tools"),
  },
  {
    id: "text-tools",
    name: "Text Tools",
    description: "Utilidades para comparar, formatear y transformar texto.",
    href: "/text-tools",
    icon: Text,
    toolCount: 2,
    status: "available",
    tools: tools.filter((t) => t.category === "text-tools"),
  },
  {
    id: "database",
    name: "Database",
    description: "Exploración y administración de bases de datos.",
    href: "/database",
    icon: Database,
    toolCount: 1,
    status: "beta",
    tools: tools.filter((t) => t.category === "database"),
  },
  {
    id: "ai-assistant",
    name: "AI Assistant",
    description: "Asistente de inteligencia artificial para desarrolladores.",
    href: "/ai-assistant",
    icon: Bot,
    toolCount: 1,
    status: "coming-soon",
    tools: tools.filter((t) => t.category === "ai-assistant"),
  },
];

export const navigation = [
  { id: "dashboard", name: "Dashboard", href: "/", icon: LayoutDashboard },
  ...modules.map(({ id, name, href, icon }) => ({ id, name, href, icon })),
  { id: "settings", name: "Settings", href: "/settings", icon: Settings },
];

export const statusLabels: Record<ToolStatus, string> = {
  available: "Disponible",
  beta: "Beta",
  "coming-soon": "Próximamente",
};

export function getToolById(id: string) {
  return tools.find((tool) => tool.id === id);
}

export function getModuleById(id: string) {
  return modules.find((module) => module.id === id);
}

export const mostUsedTools = [
  tools[0],
  tools[3],
  tools[1],
  tools[4],
];

export const quickAccess = [
  { label: "Nueva consulta SQL", href: "/tools/sql-generator", icon: Sparkles },
  { label: "Excel → SQL", href: "/tools/excel-to-sql", icon: FileSpreadsheet },
  { label: "Formatear SQL", href: "/tools/sql-formatter", icon: Wrench },
];

export const recentHistory = [
  { tool: tools[0], usedAt: "Hace 2 min" },
  { tool: tools[3], usedAt: "Hace 15 min" },
  { tool: tools[1], usedAt: "Hace 1 h" },
  { tool: tools[4], usedAt: "Ayer" },
];

export const favorites = [tools[0], tools[3], tools[2]];
