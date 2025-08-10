Attribute VB_Name = "ImportIntoDivision"
Sub ImportIntoDivision()
    Dim div As String, csv As String, lines() As String, r As Long, i As Long
    div = InputBox("Division (e.g., 09 - Finishes)")
    If div = "" Then Exit Sub
    csv = InputBox("Paste CSV rows: Item Name, Description, Unit, Qty, Unit Price, Tags")
    If csv = "" Then Exit Sub

    Dim ws As Worksheet: Set ws = ThisWorkbook.Worksheets("Takeoff")
    Dim headers As Range: Set headers = ws.Rows(1)
    Dim colMap As Object: Set colMap = CreateObject("Scripting.Dictionary")
    Dim cell As Range
    For Each cell In headers.Cells
        If Not IsEmpty(cell.Value) Then colMap(cell.Value) = cell.Column
    Next cell

    r = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row + 1

    ws.Rows(2).Copy
    ws.Rows(r & ":" & r).Resize(1).PasteSpecial xlPasteFormulas

    lines = Split(csv, vbNewLine)
    For i = LBound(lines) To UBound(lines)
        Dim parts() As String
        parts = Split(lines(i), ",")
        If UBound(parts) >= 0 Then
            ws.Cells(r, colMap("Division")).Value = div
            ws.Cells(r, colMap("Item Name")).Value = Trim(parts(0))
            ws.Cells(r, colMap("Description")).Value = Trim(parts(1))
            ws.Cells(r, colMap("Unit")).Value = Trim(parts(2))
            ws.Cells(r, colMap("Qty")).Value = Val(parts(3))
            ws.Cells(r, colMap("Unit Price")).Value = Val(parts(4))
            ws.Cells(r, colMap("Tags")).Value = Trim(parts(5))
            r = r + 1
            ws.Rows(2).Copy
            ws.Rows(r & ":" & r).Resize(1).PasteSpecial xlPasteFormulas
        End If
    Next i
End Sub
