"use client";

import { CopyButton } from "@/components/shared/copy-button";
import type {
  UpdateValidationBlocks,
  UpdateValidationOptions,
} from "@/features/sql-generator/types";

type UpdateValidationCopyButtonsProps = {
  validationOptions: UpdateValidationOptions;
  validationBlocks: UpdateValidationBlocks | null;
};

function UpdateValidationCopyButtons({
  validationOptions,
  validationBlocks,
}: UpdateValidationCopyButtonsProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-wrap gap-2 lg:justify-end">
        {validationOptions.includePreSelect && (
          <CopyButton
            text={validationBlocks?.preSelect ?? null}
            label="Copiar SELECT previo"
            successMessage="SELECT previo copiado al portapapeles"
            variant="secondary"
          />
        )}
        {validationOptions.includeUpdate && (
          <CopyButton
            text={validationBlocks?.update ?? null}
            label="Copiar UPDATE"
            successMessage="UPDATE copiado al portapapeles"
            variant="secondary"
          />
        )}
        {validationOptions.includePostSelect && (
          <CopyButton
            text={validationBlocks?.postSelect ?? null}
            label="Copiar SELECT posterior"
            successMessage="SELECT posterior copiado al portapapeles"
            variant="secondary"
          />
        )}
      </div>
      {validationBlocks && (
        <p className="text-[11px] leading-snug text-muted">
          Cada botón copia solamente su bloque, sin separadores GO. Los SELECT
          y el UPDATE se copian completos; el límite de 20 aplica solo a la
          vista previa.
        </p>
      )}
    </div>
  );
}

export { UpdateValidationCopyButtons };
