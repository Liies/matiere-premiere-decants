import { describe, expect, it } from "vitest";
import { parseCsvContent, detectSeparator, validateAndPreviewCsv } from "@shared/csv-import";

describe("CSV Import Logic", () => {
  it("detects separator correctly", () => {
    expect(detectSeparator("brand,name,slug,sizeml")).toBe(",");
    expect(detectSeparator("brand;name;slug;sizeml")).toBe(";");
  });

  it("parses CSV content with BOM and commas/semicolons", () => {
    const csv = "\ufeffbrand;name;slug;sizeml;sku;pricecents;stock\nMatière Première;Vanilla Powder;vanilla-powder;50;MP-VP-50;12000;10";
    const { headers, rows } = parseCsvContent(csv);
    expect(headers).toContain("brand");
    expect(headers).toContain("sizeml");
    expect(rows.length).toBe(1);
    expect(rows[0][0]).toBe("Matière Première");
  });

  it("validates CSV and generates correct preview actions without writing", () => {
    const csv = `brand,name,slug,concentration,gender,sizeMl,sku,priceCents,stock,status
Matière Première,Vanilla Powder,vanilla-powder,parfum,mixte,50,MP-VP-50,12000,10,available
Matière Première,Vanilla Powder,vanilla-powder,parfum,mixte,2,MP-VP-02,1000,10,available`;

    const existingSlugs = new Set(["vanilla-powder"]);
    const existingSkus = new Set(["MP-VP-50"]);

    const report = validateAndPreviewCsv(csv, existingSlugs, existingSkus);
    expect(report.totalRows).toBe(2);
    expect(report.validRows).toBe(2);
    expect(report.results[0].action).toBe("update_variant"); // SKU exists
    expect(report.results[1].action).toBe("create_variant"); // SKU new, slug exists
  });

  it("detects errors in invalid CSV rows", () => {
    const csv = `brand,name,slug,concentration,gender,sizeMl,sku,priceCents,stock,status
Matière Première,Invalide,invalid-slug,parfum,mixte,invalidSize,MP-INV,abc,10,available`;

    const report = validateAndPreviewCsv(csv, new Set(), new Set());
    expect(report.errorRows).toBe(1);
    expect(report.results[0].errors.length).toBeGreaterThan(0);
  });
});
