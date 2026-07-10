const SQL_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "INSERT",
  "UPDATE",
  "DELETE",
  "CREATE",
  "ALTER",
  "DROP",
  "PROCEDURE",
  "BEGIN",
  "END",
  "JOIN",
  "LEFT",
  "RIGHT",
  "INNER",
  "OUTER",
  "ON",
  "AND",
  "OR",
  "SET",
  "INTO",
  "VALUES",
  "GROUP",
  "ORDER",
  "BY",
  "HAVING",
  "AS",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
];

export function stripSqlComments(text: string): string {
  const withoutBlock = text.replace(/\/\*[\s\S]*?\*\//g, "");
  return withoutBlock
    .split("\n")
    .map((line) => line.replace(/--.*$/, ""))
    .join("\n");
}

export function formatSql(text: string): string {
  let formatted = text.replace(/\r\n/g, "\n").trim();

  for (const keyword of SQL_KEYWORDS) {
    const pattern = new RegExp(`\\b${keyword}\\b`, "gi");
    formatted = formatted.replace(pattern, keyword);
  }

  for (const keyword of ["SELECT", "FROM", "WHERE", "INSERT", "UPDATE", "DELETE", "CREATE", "SET"]) {
    const pattern = new RegExp(`\\s*\\b${keyword}\\b`, "g");
    formatted = formatted.replace(pattern, `\n${keyword}`);
  }

  return formatted
    .split("\n")
    .map((line) => line.trim())
    .filter((line, index, lines) => line.length > 0 || lines.length === 1)
    .join("\n")
    .trim();
}

export function prepareSqlForCompare(
  text: string,
  options: {
    ignoreSqlComments: boolean;
    formatBeforeCompare: boolean;
  },
): string {
  let prepared = text;

  if (options.formatBeforeCompare) {
    prepared = formatSql(prepared);
  }

  if (options.ignoreSqlComments) {
    prepared = stripSqlComments(prepared);
  }

  return prepared;
}
