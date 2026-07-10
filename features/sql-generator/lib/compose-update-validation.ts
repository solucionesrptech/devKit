import type {
  SqlDialect,
  SqlUpdateInput,
  UpdateValidationBlocks,
  UpdateValidationOptions,
} from "../types";

import { formatValidationSelect } from "./format-validation-select";

function buildSectionBanner(title: string): string {
  return [
    "-- ============================================",
    `-- ${title}`,
    "-- ============================================",
  ].join("\n");
}

function getBlockSeparator(dialect: SqlDialect): string {
  return dialect === "sqlserver" ? "\n\nGO\n\n" : "\n\n";
}

function hasValidationSelect(options: UpdateValidationOptions): boolean {
  return options.includePreSelect || options.includePostSelect;
}

export function buildUpdateValidationBlocks(
  input: SqlUpdateInput,
  updateSql: string,
  options: UpdateValidationOptions,
): UpdateValidationBlocks | null {
  if (
    !options.includePreSelect &&
    !options.includeUpdate &&
    !options.includePostSelect
  ) {
    return null;
  }

  const validationSelect = formatValidationSelect(input);
  const withSelectBlocks = hasValidationSelect(options);

  const preSelect = options.includePreSelect
    ? `${buildSectionBanner("VALIDACIÓN PREVIA")}\n\n${validationSelect}`
    : null;

  let update: string | null = null;
  if (options.includeUpdate) {
    update = withSelectBlocks
      ? `${buildSectionBanner("UPDATE")}\n\n${updateSql}`
      : updateSql;
  }

  const postSelect = options.includePostSelect
    ? `${buildSectionBanner("VALIDACIÓN POSTERIOR")}\n\n${validationSelect}`
    : null;

  if (!preSelect && !update && !postSelect) {
    return null;
  }

  return { preSelect, update, postSelect };
}

export function joinValidationBlocks(
  blocks: UpdateValidationBlocks,
  dialect: SqlDialect,
): string {
  const parts = [blocks.preSelect, blocks.update, blocks.postSelect].filter(
    (block): block is string => block !== null,
  );

  return parts.join(getBlockSeparator(dialect));
}

export function composeUpdateValidationScript(
  input: SqlUpdateInput,
  updateSql: string,
  options: UpdateValidationOptions,
): string | null {
  const blocks = buildUpdateValidationBlocks(input, updateSql, options);

  if (!blocks) {
    return null;
  }

  if (
    options.includeUpdate &&
    !options.includePreSelect &&
    !options.includePostSelect
  ) {
    return updateSql;
  }

  return joinValidationBlocks(blocks, input.dialect);
}
