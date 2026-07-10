import { describe, expect, it } from "vitest";

import { formatInClause } from "../lib/format-in-clause";

describe("formatInClause", () => {
  it("formatea números sin comillas", () => {
    expect(formatInClause(["2130933", "2130934"], "number")).toBe(
      "2130933,\n2130934",
    );
  });

  it("formatea texto con comillas simples", () => {
    expect(formatInClause(["11111111-1", "22222222-2"], "text")).toBe(
      "'11111111-1',\n'22222222-2'",
    );
  });

  it("escapa comillas simples en texto", () => {
    expect(formatInClause(["O'Brien"], "text")).toBe("'O''Brien'");
  });
});
