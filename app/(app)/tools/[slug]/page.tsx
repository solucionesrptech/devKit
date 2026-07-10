import { notFound } from "next/navigation";

import { ToolPageHeader } from "@/components/shared/tool-page-header";
import { ToolPageLayout } from "@/components/shared/tool-page-layout";
import { ToolPlaceholder } from "@/components/shared/tool-placeholder";
import { getToolById } from "@/lib/config/modules";
import { getToolPage } from "@/lib/config/tool-pages";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolById(slug);

  if (!tool) {
    notFound();
  }

  const pageEntry = getToolPage(slug);
  const FeaturePage = pageEntry?.Component;

  return (
    <ToolPageLayout width={pageEntry?.layoutWidth}>
      <ToolPageHeader
        tool={tool}
        description={pageEntry?.description}
      />
      {FeaturePage ? (
        <FeaturePage />
      ) : (
        <ToolPlaceholder tool={tool} />
      )}
    </ToolPageLayout>
  );
}

export async function generateStaticParams() {
  const { tools } = await import("@/lib/config/modules");
  return tools.map((tool) => ({ slug: tool.id }));
}
