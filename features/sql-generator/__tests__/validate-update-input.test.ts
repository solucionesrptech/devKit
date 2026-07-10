import { describe, expect, it } from "vitest";

import { validateUpdateInput } from "../lib/validate-update-input";

describe("validateUpdateInput", () => {
  it("rechaza sin assignments", () => {
    expect(
      validateUpdateInput({
        assignments: [],
        whereValues: ["1"],
        whereDataType: "number",
      }),
    ).toBe("Agrega al menos una columna SET.");
  });

  it("acepta assignment con tipo NULL sin valor", () => {
    expect(
      validateUpdateInput({
        assignments: [{ column: "ultimavez", value: "", dataType: "null" }],
        whereValues: ["14475488-3"],
        whereDataType: "text",
      }),
    ).toBeNull();
  });
});
