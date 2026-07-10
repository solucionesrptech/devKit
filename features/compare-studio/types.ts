export type CompareMode =
  | "auto"
  | "list"
  | "code"
  | "sql"
  | "json"
  | "xml";

export type CompareSourceKind = "paste" | "file";

export type CompareOptions = {
  ignoreWhitespace: boolean;
  ignoreEmptyLines: boolean;
  ignoreLineBreaks: boolean;
  ignoreCase: boolean;
  ignoreSqlComments: boolean;
  formatBeforeCompare: boolean;
};

export type CompareSummary = {
  isEqual: boolean;
  totalDifferences: number;
  added: number;
  removed: number;
  modified: number;
  unchanged: number;
};

export type DiffLineType = "equal" | "add" | "remove" | "modify";

export type DiffLine = {
  type: DiffLineType;
  leftLineNumber?: number;
  rightLineNumber?: number;
  leftContent?: string;
  rightContent?: string;
};

export type ListCompareResult = {
  kind: "list";
  summary: CompareSummary;
  matches: string[];
  onlyLeft: string[];
  onlyRight: string[];
  counts: {
    matches: number;
    onlyLeft: number;
    onlyRight: number;
  };
};

export type TextCompareResult = {
  kind: "text" | "code" | "sql" | "xml";
  summary: CompareSummary;
  lines: DiffLine[];
  preparedLeft: string;
  preparedRight: string;
};

export type JsonCompareResult = {
  kind: "json";
  summary: CompareSummary;
  lines: DiffLine[];
  preparedLeft: string;
  preparedRight: string;
  isValidLeft: boolean;
  isValidRight: boolean;
  parseErrorLeft?: string;
  parseErrorRight?: string;
  addedKeys: string[];
  removedKeys: string[];
};

export type CompareResult =
  | ListCompareResult
  | TextCompareResult
  | JsonCompareResult;

export const DEFAULT_COMPARE_OPTIONS: CompareOptions = {
  ignoreWhitespace: true,
  ignoreEmptyLines: true,
  ignoreLineBreaks: false,
  ignoreCase: false,
  ignoreSqlComments: false,
  formatBeforeCompare: false,
};

export const COMPARE_FILE_EXTENSIONS = [
  ".sql",
  ".php",
  ".js",
  ".ts",
  ".tsx",
  ".jsx",
  ".json",
  ".xml",
  ".txt",
  ".md",
  ".log",
  ".csv",
] as const;
