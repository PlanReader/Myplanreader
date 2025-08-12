import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import XlsxPopulate from "xlsx-populate";
import { nanoid } from "nanoid";

export const config = { api: { bodyParser: false } };

type Item = {
  Division: string;
  ItemName: string;
  Description: string;
  Unit: string;
  Qty: number;
  UnitPrice: number;
  Tags: string;
  SourcePage?: number | string;
};

async function parsePdfToItems(filePath: string): Promise<Item[]> {
  // Stub parser (replace with your real parser service).
  return [
    { Division: "08 - Openings", ItemName: 'Window 36" x 60"', Description: "Single hung, impact", Unit: "EA", Qty: 5, UnitPrice: 650, Tags: "window schedule", SourcePage: 5 },
    { Division: "06 - Wood, Plastics, Composites", ItemName: "2x4 SYP Studs 10'", Description: 'Studs @16" O.C.', Unit: "EA", Qty: 110, UnitPrice: 4.25, Tags: "framing studs", SourcePage: 8 },
    { Division: "07 - Thermal & Moisture Protection", ItemName: "Architectural Shingles", Description: "30-yr laminated", Unit: "SQ (100 SF)", Qty: 28, UnitPrice: 500, Tags: "roof shingle", SourcePage: 9 },
  ];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const form = formidable({ multiples: false });
    const { files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
    });

    const file: any = files?.plan;
    if (!file) return res.status(400).json({ error: "No file uploaded (use field name 'plan')." });

    const pdfPath = (Array.isArray(file) ? file[0] : file).filepath as string;
    const items = await parsePdfToItems(pdfPath);

    const templatePath = path.join(process.cwd(), "server/assets/template.xlsx");
    const workbook = await XlsxPopulate.fromFileAsync(templatePath);
    const ws = workbook.sheet("Takeoff");

    const headers = ws.usedRange().value()[0] as string[];
    const col = (name: string) => headers.indexOf(name) + 1;

    const rStart = 2;
    if (items.length > 1) ws.rows(rStart + 1, rStart + items.length - 1).insert();

    const row2 = ws.row(2).value();
    for (let i = 1; i < items.length; i++) ws.row(rStart + i).value(row2);

    items.forEach((it, idx) => {
      const r = rStart + idx;
      ws.cell(r, col("Division")).value(it.Division);
      ws.cell(r, col("Item Name")).value(it.ItemName);
      ws.cell(r, col("Description")).value(it.Description);
      ws.cell(r, col("Unit")).value(it.Unit);
      ws.cell(r, col("Qty")).value(it.Qty);
      ws.cell(r, col("Unit Price")).value(it.UnitPrice);
      ws.cell(r, col("Tags")).value(it.Tags);
      ws.cell(r, col("Source Page")).value(it.SourcePage ?? "");
    });

    const id = nanoid(8);
    const outRel = `exports/takeoff_${id}.xlsx`;
    const outAbs = path.join(process.cwd(), "public", outRel);
    await fs.mkdir(path.dirname(outAbs), { recursive: true });
    await workbook.toFileAsync(outAbs);
    return res.status(200).json({ url: `/${outRel}` });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: "Failed to process plan." });
  }
}
