import { describe, expect, it } from "vitest";

import { parseValuesFromText } from "../lib/parse-values";

describe("parseValuesFromText", () => {
  it("ignora líneas vacías y espacios", () => {
    const result = parseValuesFromText("  2130933 \n\n2130934  \n");
    expect(result.values).toEqual(["2130933", "2130934"]);
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

  it("conserva RUT con guión", () => {
    const result = parseValuesFromText("11111111-1\n22222222-2");
    expect(result.values).toEqual(["11111111-1", "22222222-2"]);
  });
});
