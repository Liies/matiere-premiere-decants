export interface CsvProductRow {
  brand: string;
  name: string;
  slug: string;
  concentration: "edt" | "edp" | "extrait" | "parfum" | "esprit" | "cologne";
  gender: "homme" | "femme" | "mixte";
  perfumer?: string;
  releaseYear?: number;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
  description?: string;
  sizeMl: number;
  sku: string;
  priceCents: number;
  stock: number;
  imageUrl?: string;
  status: "available" | "out_of_stock" | "discontinued" | "coming_soon";
}

export interface CsvImportRowResult {
  rowNumber: number;
  data?: CsvProductRow;
  action: "create_product" | "update_product" | "create_variant" | "update_variant" | "skip" | "error";
  errors: string[];
}

export interface CsvImportPreviewReport {
  totalRows: number;
  validRows: number;
  errorRows: number;
  results: CsvImportRowResult[];
}

export function detectSeparator(headerLine: string): "," | ";" {
  const commaCount = (headerLine.match(/,/g) || []).length;
  const semicolonCount = (headerLine.match(/;/g) || []).length;
  return semicolonCount > commaCount ? ";" : ",";
}

export function parseCsvLine(line: string, separator: "," | ";"): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === separator && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseCsvContent(content: string): { headers: string[]; rows: string[][] } {
  // Strip BOM if present
  let clean = content;
  if (clean.charCodeAt(0) === 0xfeff) {
    clean = clean.slice(1);
  }

  const lines = clean.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const separator = detectSeparator(lines[0]);
  const headers = parseCsvLine(lines[0], separator).map((h) => h.toLowerCase().trim());
  const rows: string[][] = [];

  for (let i = 1; i < lines.length; i++) {
    rows.push(parseCsvLine(lines[i], separator));
  }

  return { headers, rows };
}

export function validateAndPreviewCsv(
  content: string,
  existingSlugs: Set<string>,
  existingSkus: Set<string>
): CsvImportPreviewReport {
  const { headers, rows } = parseCsvContent(content);
  const results: CsvImportRowResult[] = [];
  const seenSkusInFile = new Set<string>();
  const seenSlugsInFile = new Set<string>();

  const requiredHeaders = ["brand", "name", "slug", "sizeml", "sku", "pricecents", "stock"];
  for (const req of requiredHeaders) {
    if (!headers.includes(req)) {
      return {
        totalRows: rows.length,
        validRows: 0,
        errorRows: rows.length,
        results: [
          {
            rowNumber: 0,
            action: "error",
            errors: [`En-tête obligatoire manquant : "${req}". En-têtes reçus : ${headers.join(", ")}`],
          },
        ],
      };
    }
  }

  const colMap = new Map<string, number>();
  headers.forEach((h, idx) => colMap.set(h, idx));

  let validRows = 0;
  let errorRows = 0;

  rows.forEach((cols, idx) => {
    const rowNumber = idx + 2;
    const errors: string[] = [];

    const getCol = (key: string) => {
      const pos = colMap.get(key);
      return pos !== undefined ? cols[pos] ?? "" : "";
    };

    const brand = getCol("brand");
    const name = getCol("name");
    const slug = getCol("slug");
    const concentration = (getCol("concentration") || "parfum") as any;
    const gender = (getCol("gender") || "mixte") as any;
    const sizeMlStr = getCol("sizeml");
    const sku = getCol("sku");
    const priceCentsStr = getCol("pricecents");
    const stockStr = getCol("stock");
    const status = (getCol("status") || "available") as any;

    if (!brand) errors.push("Marque manquante");
    if (!name) errors.push("Nom manquant");
    if (!slug) errors.push("Slug manquant");
    if (!sku) errors.push("SKU manquant");

    const sizeMl = Number(sizeMlStr);
    if (isNaN(sizeMl) || sizeMl <= 0) errors.push(`Taille en ml invalide : "${sizeMlStr}"`);

    const priceCents = Number(priceCentsStr);
    if (isNaN(priceCents) || priceCents < 0) errors.push(`Prix en centimes invalide : "${priceCentsStr}"`);

    const stock = Number(stockStr);
    if (isNaN(stock) || stock < 0) errors.push(`Stock invalide : "${stockStr}"`);

    if (sku) {
      if (seenSkusInFile.has(sku)) {
        errors.push(`SKU dupliqué dans le fichier : "${sku}"`);
      } else {
        seenSkusInFile.add(sku);
      }
    }

    if (slug) {
      seenSlugsInFile.add(slug);
    }

    if (errors.length > 0) {
      errorRows++;
      results.push({
        rowNumber,
        action: "error",
        errors,
      });
    } else {
      validRows++;
      const isExistingProduct = existingSlugs.has(slug);
      const isExistingVariant = existingSkus.has(sku);
      const action = isExistingVariant ? "update_variant" : isExistingProduct ? "create_variant" : "create_product";

      results.push({
        rowNumber,
        data: {
          brand,
          name,
          slug,
          concentration,
          gender,
          perfumer: getCol("perfumer") || undefined,
          releaseYear: getCol("releaseyear") ? Number(getCol("releaseyear")) : undefined,
          topNotes: getCol("topnotes") || undefined,
          heartNotes: getCol("heartnotes") || undefined,
          baseNotes: getCol("basenotes") || undefined,
          description: getCol("description") || undefined,
          sizeMl,
          sku,
          priceCents,
          stock,
          imageUrl: getCol("imageurl") || undefined,
          status,
        },
        action,
        errors: [],
      });
    }
  });

  return {
    totalRows: rows.length,
    validRows,
    errorRows,
    results,
  };
}
