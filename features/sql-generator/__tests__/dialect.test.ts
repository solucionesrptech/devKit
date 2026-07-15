import { describe, expect, it } from "vitest";

import { resolveStatement } from "../lib/dialect";

describe("resolveStatement", () => {
  it("retorna el SQL base sin modificar en MVP", () => {
    const base = "SELECT *\nFROM users\nWHERE id IN (1);";
    expect(
      resolveStatement({ operation: "SELECT", dialect: "sqlserver" }, base),
    ).toBe(base);
    expect(
      resolveStatement({ operation: "SELECT", dialect: "postgresql" }, base),
    ).toBe(base);
  });
});
