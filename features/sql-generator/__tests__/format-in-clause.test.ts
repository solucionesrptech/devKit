import { describe, expect, it } from "vitest";

import { formatInClause } from "../lib/format-in-clause";

describe("formatInClause", () => {
  it("formatea números sin comillas", () => {
    expect(formatInClause(["101", "102"], "number")).toBe(
      "101,\n102",
    );
  });

  it("formatea texto con comillas simples", () => {
    expect(formatInClause(["user-002", "user-003"], "text")).toBe(
      "'user-002',\n'user-003'",
    );
  });

  it("escapa comillas simples en texto", () => {
    expect(formatInClause(["O'Brien"], "text")).toBe("'O''Brien'");
  });
});
