import { describe, expect, it } from "vitest";

import { detectCompareMode, runCompare } from "../lib/compare-text";
import { DEFAULT_COMPARE_OPTIONS } from "../types";

describe("detectCompareMode", () => {
  it("detecta JSON", () => {
    expect(detectCompareMode('{"a":1}', '{"a":2}')).toBe("json");
  });

  it("detecta SQL", () => {
    expect(
      detectCompareMode("SELECT * FROM users", "SELECT id FROM users"),
    ).toBe("sql");
  });

  it("detecta listas cortas", () => {
    expect(detectCompareMode("1\n2\n3", "3\n4\n5")).toBe("list");
  });
});

describe("runCompare", () => {
  it("compara listas en modo automático", () => {
    const result = runCompare("1\n2", "2\n3", "auto", DEFAULT_COMPARE_OPTIONS);
    expect(result?.kind).toBe("list");
  });

  it("compara código línea por línea", () => {
    const result = runCompare("linea\nb", "linea\nc", "code", DEFAULT_COMPARE_OPTIONS);
    expect(result?.kind).toBe("code");
    if (result && result.kind !== "list") {
      expect(result.summary.totalDifferences).toBeGreaterThan(0);
    }
  });
});
