import { useState } from "react";

/* ================= MOCK DB ================= */
const mockOpenReturns = [
  {
    requestNo: "IADE-12",
    customerCode: "MUS001",
    customerName: "ABC ECZANESİ",
    status: "OPEN",
    invoiceNo: "",
    invoiceDate: "",
    sapOrderNo: "",
    sapDeliveryNo: "",
    returnReason: "SKT",
    items: [
      {
        barcode: "869000000001",
        productCode: "URUN001",
        productName: "Ürün A",
        lot: "P001",
        sktSaleDiffDay: 120,
        quantity: 10,
        unitPrice: 150,
        vatRate: 10,
        decision: "ACCEPT"
      },
      {
        barcode: "869000000002",
        productCode: "URUN002",
        productName: "Ürün B",
        lot: "P002",
        sktSaleDiffDay: 60,
        quantity: 5,
        unitPrice: 200,
        vatRate: 10,
        decision: "REJECT",
        rejectNote: "SKT uygun değil"
      }
    ]
  }
];

export default function ReturnQuery() {
  const [selectedReturn, setSelectedReturn] = useState(null);

  /* ================= LIST MODE ================= */
  if (!selectedReturn) {
    return (
      <>
        <h2>Açık İade Talepleri</h2>

        <table border="1" width="100%" cellPadding="6">
          <thead>
            <tr>
              <th>Talep No</th>
              <th>Müşteri</th>
              <th>Durum</th>
              <th>İade Sebebi</th>
            </tr>
          </thead>
          <tbody>
            {mockOpenReturns.map((r) => (
              <tr
                key={r.requestNo}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedReturn(r)}
              >
                <td>{r.requestNo}</td>
                <td>{r.customerName}</td>
                <td>Açık</td>
                <td>{r.returnReason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }

  /* ================= DETAIL MODE ================= */
  const accepted = selectedReturn.items.filter(i => i.decision === "ACCEPT");
  const rejected = selectedReturn.items.filter(i => i.decision === "REJECT");

  return (
    <>
      <h2>{selectedReturn.requestNo}</h2>

      {/* ================= ÜST BİLGİLER ================= */}
      <div style={headerGrid}>
        <Field label="Müşteri">
          {selectedReturn.customerCode} - {selectedReturn.customerName}
        </Field>

        <Field label="e-Fatura Numarası">
          <input
            value={selectedReturn.invoiceNo}
            onChange={(e) =>
              setSelectedReturn({ ...selectedReturn, invoiceNo: e.target.value })
            }
          />
        </Field>

        <Field label="e-Fatura Tarihi">
          <input
            type="date"
            value={selectedReturn.invoiceDate}
            onChange={(e) =>
              setSelectedReturn({ ...selectedReturn, invoiceDate: e.target.value })
            }
          />
        </Field>

        <Field label="SAP İade Sipariş No">
          <input
            value={selectedReturn.sapOrderNo}
            onChange={(e) =>
              setSelectedReturn({ ...selectedReturn, sapOrderNo: e.target.value })
            }
          />
        </Field>

        <Field label="SAP İade Teslimat No">
          <input
            value={selectedReturn.sapDeliveryNo}
            onChange={(e) =>
              setSelectedReturn({
                ...selectedReturn,
                sapDeliveryNo: e.target.value
              })
            }
          />
        </Field>

        <Field label="İade Sebebi">
          <input value={selectedReturn.returnReason} readOnly />
        </Field>
      </div>

      <hr />

      {/* ================= KABULLER ================= */}
      {accepted.length > 0 && (
        <>
          <h3>Kabuller</h3>
          <table border="1" width="100%" cellPadding="6">
            <thead>
              <tr>
                <th>#</th>
                <th>Barkod</th>
                <th>Ürün Kodu</th>
                <th>Ürün Adı</th>
                <th>Parti</th>
                <th>SKT / Satış (gün)</th>
                <th>Adet</th>
                <th>Birim Fiyat</th>
                <th>KDV %</th>
              </tr>
            </thead>
            <tbody>
              {accepted.map((i, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{i.barcode}</td>
                  <td>{i.productCode}</td>
                  <td>{i.productName}</td>
                  <td>
                    <input
                      value={i.lot}
                      onChange={(e) => updateItem(selectedReturn, setSelectedReturn, idx, "lot", e.target.value)}
                    />
                  </td>
                  <td>{i.sktSaleDiffDay}</td>
                  <td>
                    <input
                      type="number"
                      value={i.quantity}
                      onChange={(e) => updateItem(selectedReturn, setSelectedReturn, idx, "quantity", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={i.unitPrice}
                      onChange={(e) => updateItem(selectedReturn, setSelectedReturn, idx, "unitPrice", e.target.value)}
                    />
                  </td>
                  <td>{i.vatRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ================= REDLER ================= */}
      {rejected.length > 0 && (
        <>
          <h3 style={{ marginTop: "25px" }}>Redler</h3>
          <table border="1" width="100%" cellPadding="6">
            <thead>
              <tr>
                <th>#</th>
                <th>Barkod</th>
                <th>Ürün</th>
                <th>Parti</th>
                <th>Adet</th>
                <th>Red Notu</th>
              </tr>
            </thead>
            <tbody>
              {rejected.map((i, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{i.barcode}</td>
                  <td>{i.productName}</td>
                  <td>{i.lot}</td>
                  <td>{i.quantity}</td>
                  <td>{i.rejectNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ================= AKSİYONLAR ================= */}
      <div style={{ marginTop: "25px" }}>
        <button onClick={() => setSelectedReturn(null)}>Geri Dön</button>
<button
  style={{ marginLeft: "10px" }}
  onClick={() => {
    const isReadyForEkol =
      selectedReturn.invoiceNo &&
      selectedReturn.invoiceDate &&
      selectedReturn.sapOrderNo &&
      selectedReturn.sapDeliveryNo;

    const updated = {
      ...selectedReturn,
      status: isReadyForEkol
        ? "READY_FOR_EKOL"
        : "OPEN"
    };

    console.log("UPDATED RETURN", updated);

    alert(
      isReadyForEkol
        ? "İade EKOL'e gönderilebilir duruma alındı"
        : "İade açık olarak kaydedildi"
    );

    setSelectedReturn(null); // listeye dön
  }}
>
  Kaydet
</button>

      </div>
    </>
  );
}

/* ================= HELPERS ================= */
function updateItem(data, setData, index, field, value) {
  const updated = { ...data };
  updated.items[index] = { ...updated.items[index], [field]: value };
  setData(updated);
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: "12px", color: "#666" }}>{label}</div>
      {children}
    </div>
  );
}

/* ================= STYLES ================= */
const headerGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "12px",
  marginBottom: "15px"
};
