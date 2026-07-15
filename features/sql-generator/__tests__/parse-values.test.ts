import { describe, expect, it } from "vitest";

import { parseValuesFromText } from "../lib/parse-values";

describe("parseValuesFromText", () => {
  it("ignora líneas vacías y espacios", () => {
    const result = parseValuesFromText("  101 \n\n102  \n");
    expect(result.values).toEqual(["101", "102"]);
    expect(result.stats.omittedEmpty).toBe(2);
  });

  it("conserva duplicados por defecto", () => {
    const result = parseValuesFromText("a\nb\na\nc\nb");
    expect(result.values).toEqual(["a", "b", "a", "c", "b"]);
    expect(result.stats.omittedDuplicates).toBe(0);
  });

  it("elimina duplicados solo con opción activa", () => {
    const result = parseValuesFromText("a\nb\na\nc\nb", true);
    expect(result.values).toEqual(["a", "b", "c"]);
    expect(result.stats.omittedDuplicates).toBe(2);
  });

  it("conserva identificadores con guión", () => {
    const result = parseValuesFromText("user-001\nuser-002");
    expect(result.values).toEqual(["user-001", "user-002"]);
  });
});
