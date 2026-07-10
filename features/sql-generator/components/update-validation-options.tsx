"use client";

import type { UpdateValidationOptions } from "@/features/sql-generator/types";

type UpdateValidationOptionsProps = {
  options: UpdateValidationOptions;
  onChange: (options: UpdateValidationOptions) => void;
};

function UpdateValidationOptionsPanel({
  options,
  onChange,
}: UpdateValidationOptionsProps) {
  const handleChange = (
    key: keyof UpdateValidationOptions,
    checked: boolean,
  ) => {
    onChange({ ...options, [key]: checked });
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="update-validation-pre-select"
        className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
      >
        <input
          id="update-validation-pre-select"
          type="checkbox"
          checked={options.includePreSelect}
          onChange={(e) => handleChange("includePreSelect", e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        Generar SELECT previo
      </label>
      <label
        htmlFor="update-validation-update"
        className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
      >
        <input
          id="update-validation-update"
          type="checkbox"
          checked={options.includeUpdate}
          onChange={(e) => handleChange("includeUpdate", e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        Generar UPDATE
      </label>
      <label
        htmlFor="update-validation-post-select"
        className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
      >
        <input
          id="update-validation-post-select"
          type="checkbox"
          checked={options.includePostSelect}
          onChange={(e) => handleChange("includePostSelect", e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        Generar SELECT posterior
      </label>
    </div>
  );
}

export { UpdateValidationOptionsPanel };
