import { useState } from "react";
import ReturnItemRow from "../components/ReturnItemRow";

/* ================= MOCK DATABASE ================= */
const mockSalesDb = [
  {
    productCode: "URUN001",
    customerCode: "MUS001",
    lastSaleDate: "2023-12-12",
    price: 150,
    currency: "TRY",
  },
];

const mockBatchDb = [
  {
    productCode: "URUN001",
    lot: "PARTI001",
    skt: "2021-12-21",
  },
];

/* ================= HELPERS ================= */
const diffInMonths = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
};

/* ================= COMPONENT ================= */
export default function CreateReturn({
  products,
  customers,
  returnReasons,
  onContinue,
}) {
  /* -------- STATE -------- */
  const [customer, setCustomer] = useState("");
  const [reason, setReason] = useState("");

  const [items, setItems] = useState([
    {
      product: "",
      lot: "",
      quantity: "",
      note: "",
    },
  ]);

  const [checked, setChecked] = useState(false);
  const [checkResults, setCheckResults] = useState([]);

  /* -------- ITEM ACTIONS -------- */
  const addItem = () => {
    setItems([
      ...items,
      { product: "", lot: "", quantity: "", note: "" },
    ]);
    setChecked(false);
    setCheckResults([]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);

    setChecked(false);
    setCheckResults([]);
  };

  const updateCheckResult = (index, field, value) => {
    const updated = [...checkResults];
    updated[index] = { ...updated[index], [field]: value };
    setCheckResults(updated);
  };

  /* -------- KONTROL ET -------- */
  const handleCheck = () => {
    if (!customer || !reason) {
      alert("Müşteri ve iade sebebi seçilmelidir.");
      return;
    }

    const results = items.map((item) => {
      const sale = mockSalesDb.find(
        (s) =>
          s.productCode === item.product &&
          s.customerCode === customer
      );

      const batch = mockBatchDb.find(
        (b) =>
          b.productCode === item.product &&
          b.lot === item.lot
      );

      let messages = [];
      let approvalRequired = false;

      if (sale) {
        messages.push(
          `En son ${new Date(
            sale.lastSaleDate
          ).toLocaleDateString("tr-TR")} tarihinde ${sale.price} ${sale.currency} fiyat ile satılmıştır.`
        );
      } else {
        messages.push("Daha önce satış bulunamadı.");
        approvalRequired = true;
      }

      if (sale && batch) {
        const diff = diffInMonths(batch.skt, sale.lastSaleDate);
        if (diff < 12) {
          messages.push(
            `Parti SKT’si ${new Date(
              batch.skt
            ).toLocaleDateString("tr-TR")} olup 1 yılın altında iken satış yapılmıştır.`
          );
          approvalRequired = true;
        }
      }

      return {
        messages,
        lastSalePrice: sale?.price || "",
        currency: sale?.currency || "TRY",
        newPrice: sale?.price || "",
        vatRate: 10,
        decision: "ACCEPT", // ACCEPT | REJECT
        rejectNote: "",
        approvalRequired,
      };
    });

    setCheckResults(results);
    setChecked(true);
  };

  /* -------- DEVAM ET -------- */
const handleContinue = () => {
  console.log("DEVAM ET TIKLANDI");

  if (!checked) {
    alert("Devam etmeden önce Kontrol Et çalıştırılmalıdır.");
    return;
  }

  console.log("ONCONTINUE VAR MI?", onContinue);

  onContinue({
    customer,
    reason,
    items: items.map((item, i) => ({
      ...item,
      ...checkResults[i],
    })),
  });
};

  /* ================= RENDER ================= */
  return (
    <>
      <h2>İade Talebi Oluştur</h2>

      {/* -------- ÜST BİLGİLER -------- */}
      <div style={box}>
        <select value={customer} onChange={(e) => setCustomer(e.target.value)}>
          <option value="">Müşteri seçiniz</option>
          {customers.map((c) => (
            <option key={c.id} value={c.code}>
              {c.code} - {c.name}
            </option>
          ))}
        </select>

        <select value={reason} onChange={(e) => setReason(e.target.value)}>
          <option value="">İade sebebi seçiniz</option>
          {returnReasons.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <hr />

      {/* -------- SATIRLAR -------- */}
      {items.map((item, index) => (
        <ReturnItemRow
          key={index}
          index={index}
          item={item}
          products={products}
          checked={checked}
          result={checkResults[index]}
          onItemChange={(f, v) => updateItem(index, f, v)}
          onResultChange={(f, v) => updateCheckResult(index, f, v)}
        />
      ))}

      <button onClick={addItem}>➕ Satır Ekle</button>

      {/* -------- ALT AKSİYONLAR -------- */}
      <div style={{ marginTop: "20px" }}>
        {!checked ? (
          <button onClick={handleCheck}>Kontrol Et</button>
        ) : (
          <button
            onClick={() => {
              setChecked(false);
              setCheckResults([]);
            }}
          >
            Düzelt
          </button>
        )}

        <button
          onClick={handleContinue}
          style={{ marginLeft: "10px" }}
        >
          Devam Et
        </button>
      </div>
    </>
  );
}

/* ================= STYLES ================= */
const box = {
  display: "flex",
  gap: "10px",
  marginBottom: "15px",
};
