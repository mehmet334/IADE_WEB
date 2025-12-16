export default function ReturnSummary({ data, onBack, onSave }) {
  const accepted = data.items.filter(i => i.decision === "ACCEPT");
  const rejected = data.items.filter(i => i.decision === "REJECT");

  const calc = (item) => {
    const net = item.quantity * item.unitPrice;
    const vat = net * item.vatRate / 100;
    return { net, vat, gross: net + vat };
  };

  const totals = accepted.reduce(
    (a, i) => {
      const c = calc(i);
      a.net += c.net;
      a.vat += c.vat;
      a.gross += c.gross;
      return a;
    },
    { net: 0, vat: 0, gross: 0 }
  );

  return (
    <>
      <h2>İade Talebi Özeti</h2>

      <div>
        <strong>Müşteri:</strong> {data.customer}
      </div>

      {/* ✅ KABULLER */}
      <h3>Kabuller</h3>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Ürün</th>
            <th>Parti</th>
            <th>Adet</th>
            <th>Birim Fiyat</th>
            <th>KDV</th>
            <th>Tutar</th>
          </tr>
        </thead>
        <tbody>
          {accepted.map((i, idx) => {
            const c = calc(i);
            return (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{i.product}</td>
                <td>{i.lot}</td>
                <td>{i.quantity}</td>
                <td>{i.unitPrice}</td>
                <td>{i.vatRate}%</td>
                <td>{c.net.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ❌ REDLER */}
      <h3 style={{ marginTop: "20px" }}>Redler</h3>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>#</th>
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
              <td>{i.product}</td>
              <td>{i.lot}</td>
              <td>{i.quantity}</td>
              <td>{i.rejectNote}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔢 TOPLAMLAR */}
      <div style={{ marginTop: "20px", width: "300px", marginLeft: "auto" }}>
        <div>Toplam Tutar: {totals.net.toFixed(2)}</div>
        <div>Toplam KDV: {totals.vat.toFixed(2)}</div>
        <strong>Toplam KDV’li: {totals.gross.toFixed(2)}</strong>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={onBack}>Geri Dön</button>
        <button
          style={{ marginLeft: "10px" }}
          onClick={() =>
            onSave({
              requestNo: `IADE-${Date.now()}`,
              requestDate: new Date().toISOString().slice(0, 10),
              status: "OPEN",
              ...data,
              totals
            })
          }
        >
          Kaydet
        </button>
      </div>
    </>
  );
}
