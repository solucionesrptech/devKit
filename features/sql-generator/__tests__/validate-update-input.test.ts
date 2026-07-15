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
        assignments: [{ column: "last_login", value: "", dataType: "null" }],
        whereValues: ["user-001"],
        whereDataType: "text",
      }),
    ).toBeNull();
  });
});
