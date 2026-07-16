import { describe, expect, it } from "vitest";

import {
  detectCodeLanguage,
  getMonacoLanguage,
} from "../lib/monaco-language";

describe("detectCodeLanguage", () => {
  it("detecta TypeScript pegado", () => {
    const code = `import type { Response } from "express";
export class Controller {
  constructor(private readonly service: Service) {}
}`;

    expect(detectCodeLanguage(code, code)).toBe("typescript");
  });

  it("detecta PHP pegado", () => {
    expect(detectCodeLanguage("<?php echo 'hola';", "")).toBe("php");
  });

  it("prioriza la extensión del archivo", () => {
    expect(getMonacoLanguage("code", "archivo.tsx", undefined, "", "")).toBe(
      "typescript",
    );
  });
});
