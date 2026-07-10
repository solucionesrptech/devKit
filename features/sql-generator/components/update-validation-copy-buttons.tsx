"use client";

import { CopyButton } from "@/components/shared/copy-button";
import type {
  UpdateValidationBlocks,
  UpdateValidationOptions,
} from "@/features/sql-generator/types";

type UpdateValidationCopyButtonsProps = {
  fullSql: string | null;
  validationOptions: UpdateValidationOptions;
  validationBlocks: UpdateValidationBlocks | null;
};

function UpdateValidationCopyButtons({
  fullSql,
  validationOptions,
  validationBlocks,
}: UpdateValidationCopyButtonsProps) {
  const hasSelectBlock =
    validationOptions.includePreSelect || validationOptions.includePostSelect;

  const showBlockButtons = hasSelectBlock && validationBlocks !== null;

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-wrap gap-2 lg:justify-end">
        <CopyButton text={fullSql} label="Copiar SQL" />
        {showBlockButtons && validationOptions.includePreSelect && (
          <CopyButton
            text={validationBlocks.preSelect}
            label="Copiar SELECT previo"
            successMessage="SELECT previo copiado al portapapeles"
            variant="secondary"
          />
        )}
        {showBlockButtons && validationOptions.includeUpdate && (
          <CopyButton
            text={validationBlocks.update}
            label="Copiar UPDATE"
            successMessage="UPDATE copiado al portapapeles"
            variant="secondary"
          />
        )}
        {showBlockButtons && validationOptions.includePostSelect && (
          <CopyButton
            text={validationBlocks.postSelect}
            label="Copiar SELECT posterior"
            successMessage="SELECT posterior copiado al portapapeles"
            variant="secondary"
          />
        )}
      </div>
      {fullSql && (
        <p className="text-[11px] leading-snug text-muted">
          Copiar SQL incluye todos los bloques. Los botones secundarios copian
          un bloque sin GO.
        </p>
      )}
    </div>
  );
}

export { UpdateValidationCopyButtons };
