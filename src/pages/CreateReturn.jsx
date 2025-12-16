import { useState } from "react";
import ReturnItemRow from "../components/ReturnItemRow";

/* MOCK DATABASE */
const currentUser = {
  username: "mehmet.tezcan",
  fullName: "Mehmet Ali Tezcan",
  department: "Ticari Operasyonlar"
};
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

const diffInMonths = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
};

export default function CreateReturn({ products, customers, returnReasons }) {
  const [customer, setCustomer] = useState("");
  const [reason, setReason] = useState("");
  const [items, setItems] = useState([{ product: "", lot: "", quantity: "" }]);

  const [checked, setChecked] = useState(false);
  const [checkResults, setCheckResults] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  /* ---------------- HELPERS ---------------- */

  const calculateLine = (qty, price, vatRate) => {
    const net = qty * price;
    const vat = net * (vatRate / 100);
    const gross = net + vat;
    return { net, vat, gross };
  };
    const generateRequestNo = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `IADE-${year}-${random}`;
    };
  /* ---------------- ITEM HANDLERS ---------------- */

  const addItem = () => {
    setItems([...items, { product: "", lot: "", quantity: "" }]);
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

  /* ---------------- ACTIONS ---------------- */

  const handleCheck = () => {
    if (!customer || !reason) {
      alert("Önce müşteri ve iade sebebi seçilmelidir");
      return;
    }

    const results = items.map((item) => {
      const sale = mockSalesDb.find(
        (s) => s.productCode === item.product && s.customerCode === customer
      );

      const batch = mockBatchDb.find(
        (b) => b.productCode === item.product && b.lot === item.lot
      );

      let message = [];
      let approvalRequired = false;

      if (sale) {
        message.push(
          `En son ${new Date(sale.lastSaleDate).toLocaleDateString(
            "tr-TR"
          )} tarihinde ${sale.price} ${sale.currency} fiyat ile satılmıştır.`
        );
      } else {
        message.push("Daha önce satış bulunamadı.");
        approvalRequired = true;
      }

      if (sale && batch) {
        const diff = diffInMonths(batch.skt, sale.lastSaleDate);
        if (diff < 12) {
          message.push(
            `Parti SKT’si ${new Date(batch.skt).toLocaleDateString(
              "tr-TR"
            )} olup 1 yılın altında iken satış yapılmıştır.`
          );
          approvalRequired = true;
        }
      }

      return {
        message,
        approvalRequired,
        newPrice: "",
        priceApproved: !approvalRequired,
        lastSalePrice: sale?.price || 0,
      };
    });

    setCheckResults(results);
    setChecked(true);
  };

  const handleEdit = () => {
    setChecked(false);
    setCheckResults([]);
  };

  const allApproved =
    checked && checkResults.every((r) => r.priceApproved === true);

  const handleSave = () => {
    if (!allApproved) {
      alert("Tüm satırlar onaylanmalıdır");
      return;
    }
    setShowSummary(true);
  };

  /* ---------------- SUMMARY SCREEN ---------------- */

  if (showSummary) {
    const summaryLines = items.map((item, i) => {
      const price =
        Number(checkResults[i]?.newPrice) ||
        Number(checkResults[i]?.lastSalePrice) ||
        0;

      const qty = Number(item.quantity);
      const vatRate = 10;

      const { net, vat, gross } = calculateLine(qty, price, vatRate);

      return {
        ...item,
        price,
        vatRate,
        net,
        vat,
        gross,
      };
    });

    const totalNet = summaryLines.reduce((s, l) => s + l.net, 0);
    const totalVat = summaryLines.reduce((s, l) => s + l.vat, 0);
    const totalGross = summaryLines.reduce((s, l) => s + l.gross, 0);

    return (
      <>
        <h2>İade Talebi Özeti</h2>

        <strong>Müşteri:</strong> {customer}

        <table border="1" cellPadding="6" width="100%" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Ürün</th>
              <th>Parti</th>
              <th>Adet</th>
              <th>Fiyat</th>
              <th>KDV %</th>
              <th>KDV’siz Tutar</th>
            </tr>
          </thead>
          <tbody>
            {summaryLines.map((l, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{l.product}</td>
                <td>{l.lot}</td>
                <td>{l.quantity}</td>
                <td>{l.price.toFixed(2)}</td>
                <td>{l.vatRate}</td>
                <td>{l.net.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 20, width: 300, marginLeft: "auto" }}>
          <div>Toplam KDV’siz: {totalNet.toFixed(2)}</div>
          <div>Toplam KDV: {totalVat.toFixed(2)}</div>
          <strong>Toplam KDV’li: {totalGross.toFixed(2)}</strong>
        </div>

        <div style={{ marginTop: 20 }}>
          <button onClick={() => setShowSummary(false)}>Geri Dön</button>
<button
  style={{ marginLeft: 10 }}
  onClick={() => {
    const requestNo = generateRequestNo();
    const requestDate = new Date().toISOString();

    const payload = {
      requestNo,
      requestDate,
      status: "OPEN",
      createdBy: currentUser,
      customerCode: customer,
      returnReasonId: Number(reason),
      totals: {
        net: totalNet,
        vat: totalVat,
        gross: totalGross
      },
      lines: summaryLines.map((l, i) => ({
        productCode: l.product,
        lot: l.lot,
        quantity: Number(l.quantity),
        unitPrice: l.price,
        vatRate: l.vatRate,
        netAmount: l.net,
        vatAmount: l.vat,
        grossAmount: l.gross,
        priceApproved: checkResults[i].priceApproved
      }))
    };

    console.log("DB KAYIT PAYLOAD:", payload);

    alert(
      `İade Talebi Oluşturuldu\n\nTalep No: ${requestNo}\nDurum: AÇIK`
    );

    // burada:
    // fetch("/api/returns", { method: "POST", body: JSON.stringify(payload) })
  }}
>
  Son Kaydet
</button>

        </div>
      </>
    );
  }

  /* ---------------- MAIN SCREEN ---------------- */

  return (
    <>
      <h2>İade Talebi Oluştur</h2>

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
              {r.id} - {r.name}
            </option>
          ))}
        </select>
      </div>

      <hr />

      {items.map((item, index) => (
        <ReturnItemRow
          key={index}
          item={item}
          products={products}
          checked={checked}
          result={checkResults[index]}
          onItemChange={(f, v) => updateItem(index, f, v)}
          onResultChange={(f, v) => updateCheckResult(index, f, v)}
        />
      ))}

      <button onClick={addItem}>➕ Ekleme</button>

      <div style={{ marginTop: 20 }}>
        {!checked ? (
          <button onClick={handleCheck}>Kontrol Et</button>
        ) : (
          <button onClick={handleEdit}>Düzelt</button>
        )}

        <button
          onClick={handleSave}
          disabled={!allApproved}
          style={{ marginLeft: 10 }}
        >
          Kaydet
        </button>
      </div>
    </>
  );
}

const box = {
  display: "flex",
  gap: "10px",
  marginBottom: "15px",
};
