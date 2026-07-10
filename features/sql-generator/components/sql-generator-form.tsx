"use client";

import type { SqlDialect, SqlOperation } from "@/features/sql-generator/types";

import { SqlInClauseForm } from "./sql-in-clause-form";
import { SqlOperationFields } from "./sql-operation-fields";
import { SqlUpdateForm } from "./sql-update-form";
import type { SqlInClauseFormProps } from "./sql-in-clause-form";
import type { SqlUpdateFormProps } from "./sql-update-form";

type SqlGeneratorFormProps = {
  operation: SqlOperation;
  dialect: SqlDialect;
  onOperationChange: (value: SqlOperation) => void;
  onDialectChange: (value: SqlDialect) => void;
  inClauseForm: SqlInClauseFormProps;
  updateForm: SqlUpdateFormProps;
};

function SqlGeneratorForm({
  operation,
  dialect,
  onOperationChange,
  onDialectChange,
  inClauseForm,
  updateForm,
}: SqlGeneratorFormProps) {
  return (
    <div className="space-y-5">
      <SqlOperationFields
        operation={operation}
        dialect={dialect}
        onOperationChange={onOperationChange}
        onDialectChange={onDialectChange}
      />

      {operation === "UPDATE" ? (
        <SqlUpdateForm {...updateForm} />
      ) : (
        <SqlInClauseForm {...inClauseForm} />
      )}
    </div>
  );
}

export { SqlGeneratorForm };
