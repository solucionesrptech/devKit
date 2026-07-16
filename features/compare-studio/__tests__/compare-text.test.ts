import { describe, expect, it } from "vitest";

import { detectCompareMode, runCompare } from "../lib/compare-text";
import { getDiffTexts } from "../lib/prepare-display";
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

  it("detecta prosa como texto y no como código", () => {
    expect(
      detectCompareMode(
        "Este es un párrafo largo escrito para una comparación visual.",
        "Este es un párrafo largo escrito para una comparación visual nueva.",
      ),
    ).toBe("text");
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

  it("ignora cortes de línea distintos al comparar texto", () => {
    const left = "Lorem ipsum es un texto largo\nque continúa aquí.";
    const right = "Lorem ipsum es un texto largo que continúa aquí. fefefef";
    const result = runCompare(left, right, "text", {
      ...DEFAULT_COMPARE_OPTIONS,
      ignoreLineBreaks: true,
    });

    expect(result?.kind).toBe("text");
    expect(result?.summary.totalDifferences).toBe(1);
  });

  it("preserva líneas vacías, saltos e indentación por defecto", () => {
    const php = "<?php\n\n    echo 'hola';\n";
    const result = runCompare(php, php, "code", DEFAULT_COMPARE_OPTIONS);
    const display = getDiffTexts(
      php,
      php,
      "code",
      DEFAULT_COMPARE_OPTIONS,
    );

    expect(result?.summary.isEqual).toBe(true);
    expect(display.original).toBe(php.slice(0, -1));
    expect(display.original).toContain("\n\n    echo");
  });
});
