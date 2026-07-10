import { describe, expect, it } from "vitest";

import { diffText, formatDiffForCopy } from "../lib/diff-lines";

describe("diffText", () => {
  it("detecta líneas agregadas y eliminadas", () => {
    const { lines, summary } = diffText("a\nb\nc", "a\nc\nd");

    expect(summary.added).toBe(1);
    expect(summary.removed).toBe(1);
    expect(summary.modified).toBe(0);
    expect(lines.some((line) => line.type === "remove" && line.leftContent === "b")).toBe(true);
    expect(lines.some((line) => line.type === "add" && line.rightContent === "d")).toBe(true);
  });

  it("formatea diff para copiar", () => {
    const { lines } = diffText("a\nb", "a\nc");
    const output = formatDiffForCopy(lines);

    expect(output).toContain("- b");
    expect(output).toContain("+ c");
  });
});
