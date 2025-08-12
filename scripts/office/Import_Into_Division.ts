// Office Script: Import CSV rows into Takeoff filtered by Division
async function main(workbook: ExcelScript.Workbook) {
  const div = await workbook.getApplication().prompt("Division (e.g., 09 - Finishes)");
  if (!div) { return; }

  const csv = await workbook.getApplication().prompt("Paste CSV rows: Item Name, Description, Unit, Qty, Unit Price, Tags");
  if (!csv) { return; }

  const ws = workbook.getWorksheet("Takeoff");
  const headerVals = ws.getRange("1:1").getValues()[0] as string[];
  const col = (name: string) => headerVals.indexOf(name) + 1;

  const used = ws.getUsedRange()?.getRowCount() ?? 1;
  const startRow = used + 1;

  const formulaRow = ws.getRangeByIndexes(1, 0, 1, headerVals.length).getFormulasR1C1()[0];
  ws.getRangeByIndexes(startRow-1, 0, 1, headerVals.length).setFormulasR1C1([formulaRow]);

  const lines = csv.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  lines.forEach((line, i) => {
    const parts = line.split(",");
    const R = startRow + i;
    ws.getRangeByIndexes(R-1, col("Division")-1, 1, 1).setValue(div);
    ws.getRangeByIndexes(R-1, col("Item Name")-1, 1, 1).setValue(parts[0] ?? "");
    ws.getRangeByIndexes(R-1, col("Description")-1, 1, 1).setValue(parts[1] ?? "");
    ws.getRangeByIndexes(R-1, col("Unit")-1, 1, 1).setValue(parts[2] ?? "");
    ws.getRangeByIndexes(R-1, col("Qty")-1, 1, 1).setValue(Number(parts[3] ?? "0"));
    ws.getRangeByIndexes(R-1, col("Unit Price")-1, 1, 1).setValue(Number(parts[4] ?? "0"));
    ws.getRangeByIndexes(R-1, col("Tags")-1, 1, 1).setValue(parts[5] ?? "");
    if (i < lines.length - 1) {
      ws.getRangeByIndexes(R, 0, 1, headerVals.length).setFormulasR1C1([formulaRow]);
    }
  });
}
