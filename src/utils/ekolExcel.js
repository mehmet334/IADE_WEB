import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function createEkolExcel(returnData, fileName) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("İade Formu");

  /* ================== SÜTUN GENİŞLİKLERİ ================== */
  ws.columns = [
    { width: 15 }, // A
    { width: 35 }, // B
    { width: 10 }, // C
    { width: 20 }, // D
    { width: 12 }, // E
    { width: 12 }, // F
    { width: 15 }, // G
    { width: 18 }, // H
    { width: 18 }, // I
    { width: 18 }, // J
    { width: 18 }  // K
  ];

  /* ================== ÜST BİLGİ ================== */
  ws.mergeCells("B3:K3");
  ws.getCell("B3").value = `MÜŞTERİ ADI : ${returnData.customerName}`;
  ws.getCell("B3").font = { bold: true };

  ws.mergeCells("B5:K5");
  ws.getCell("B5").value =
    "İADE EİP TARAFINDAN ALINACAKSA AÇIK ADRES BİLGİSİ :";
  ws.getCell("B5").font = { bold: true };

  /* ================== BAŞLIK BLOKLARI ================== */
  ws.mergeCells("A7:D7");
  ws.mergeCells("E7:I7");
  ws.mergeCells("J7:K7");

  ws.getCell("A7").value =
    "Bu bölüm Ticari Operasyonlar Müdürlüğü tarafından doldurulacaktır.";
  ws.getCell("E7").value =
    "Bu bölüm Depo tarafından doldurulacaktır.";
  ws.getCell("J7").value =
    "Bu bölüm Kalite Güvence tarafından doldurulacaktır.";

  ["A7", "E7", "J7"].forEach(cell => {
    ws.getCell(cell).alignment = { horizontal: "center", vertical: "middle" };
    ws.getCell(cell).font = { bold: true };
    ws.getCell(cell).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEFEFEF" }
    };
    ws.getCell(cell).border = fullBorder();
  });

  /* ================== TABLO BAŞLIKLARI ================== */
  const headerRow = ws.addRow([
    "ÜRÜN KODU",
    "ÜRÜN TANIMI",
    "ADET",
    "ÜRÜN GİRİŞİ OLMAYACAKSA İŞARETLEYİNİZ",
    "İADE SEBEBİ / AÇIKLAMA",
    "FİİLİ ADET",
    "PARTİ",
    "MİAD",
    "FATURA TARİHİ",
    "FATURA NO",
    "İADENİN GELİŞ TARİHİ"
  ]);

  headerRow.eachCell(cell => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF8CBAD" } // turuncu
    };
    cell.border = fullBorder();
  });

  /* ================== İADE SATIRLARI ================== */
  returnData.items.forEach(item => {
    const row = ws.addRow([
      item.productCode,
      item.productName,
      item.quantity,
      "",
      item.returnReason,
      "",
      item.lot,
      item.skt,
      returnData.invoiceDate,
      returnData.invoiceNo,
      ""
    ]);

    row.eachCell(cell => {
      cell.border = fullBorder();
    });
  });

  /* ================== DOSYA OLUŞTUR ================== */
  const buffer = await wb.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer]),
    `${fileName}.xlsx`
  );
}

/* ================== BORDER HELPER ================== */
function fullBorder() {
  return {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  };
}
