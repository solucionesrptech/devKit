import { describe, expect, it } from "vitest";

import { compareLists } from "../lib/compare-lists";
import { DEFAULT_COMPARE_OPTIONS } from "../types";

describe("compareLists", () => {
  it("detecta coincidencias y diferencias", () => {
    const result = compareLists(
      "1\n2\n3\n4",
      "3\n4\n5\n6",
      DEFAULT_COMPARE_OPTIONS,
    );

    expect(result.matches).toEqual(["3", "4"]);
    expect(result.onlyLeft).toEqual(["1", "2"]);
    expect(result.onlyRight).toEqual(["5", "6"]);
    expect(result.counts).toEqual({
      matches: 2,
      onlyLeft: 2,
      onlyRight: 2,
    });
  });
});
