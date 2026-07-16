export type ValueExtractionStats = {
  rowsDetected: number;
  validProcessed: number;
  omittedEmpty: number;
  omittedDuplicates: number;
};

export type DuplicateEntry = {
  value: string;
  count: number;
  rowNumbers: number[];
};

export type DataQualityReport = {
  rowsDetected: number;
  validRecords: number;
  uniqueValues: number;
  duplicateRecords: number;
  emptyRows: number;
};

export type ValueExtractionResult = {
  values: string[];
  quality: DataQualityReport;
  duplicates: DuplicateEntry[];
  stats: ValueExtractionStats;
  error: string | null;
};

type ExtractValuesOptions = {
  removeDuplicates: boolean;
  rowsDetected: number;
  rowNumberOffset: number;
};

function buildDuplicatesList(
  valueRows: Map<string, number[]>,
): DuplicateEntry[] {
  return Array.from(valueRows.entries())
    .filter(([, rowNumbers]) => rowNumbers.length > 1)
    .map(([value, rowNumbers]) => ({
      value,
      count: rowNumbers.length,
      rowNumbers,
    }))
    .sort((a, b) => b.count - a.count);
}

function buildQualityReport(
  rowsDetected: number,
  allValid: string[],
  emptyRows: number,
  valueRows: Map<string, number[]>,
): DataQualityReport {
  const validRecords = allValid.length;
  const uniqueValues = valueRows.size;

  return {
    rowsDetected,
    validRecords,
    uniqueValues,
    duplicateRecords: validRecords - uniqueValues,
    emptyRows,
  };
}

function buildStats(
  quality: DataQualityReport,
  validProcessed: number,
  omittedDuplicates: number,
): ValueExtractionStats {
  return {
    rowsDetected: quality.rowsDetected,
    validProcessed,
    omittedEmpty: quality.emptyRows,
    omittedDuplicates,
  };
}

export function extractValuesFromCells(
  cells: string[],
  options: ExtractValuesOptions,
): ValueExtractionResult {
  let emptyRows = 0;
  const allValid: string[] = [];
  const valueRows = new Map<string, number[]>();

  for (let i = 0; i < cells.length; i++) {
    const value = cells[i].trim();
    const rowNumber = i + options.rowNumberOffset;

    if (!value) {
      emptyRows++;
      continue;
    }

    allValid.push(value);

    const rows = valueRows.get(value);
    if (rows) {
      rows.push(rowNumber);
    } else {
      valueRows.set(value, [rowNumber]);
    }
  }

  const quality = buildQualityReport(
    options.rowsDetected,
    allValid,
    emptyRows,
    valueRows,
  );
  const duplicates = buildDuplicatesList(valueRows);

  if (!options.removeDuplicates) {
    return {
      values: allValid,
      quality,
      duplicates,
      stats: buildStats(quality, allValid.length, 0),
      error: null,
    };
  }

  const seen = new Set<string>();
  const deduped: string[] = [];
  let omittedDuplicates = 0;

  for (const value of allValid) {
    if (seen.has(value)) {
      omittedDuplicates++;
      continue;
    }
    seen.add(value);
    deduped.push(value);
  }

  return {
    values: deduped,
    quality,
    duplicates,
    stats: buildStats(quality, deduped.length, omittedDuplicates),
    error: null,
  };
}
