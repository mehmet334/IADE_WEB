export default function ReturnSummary({ data, onBack, onSave }) {
  const accepted = (data?.items || []).filter((i) => i.decision === "ACCEPT");
  const rejected = (data?.items || []).filter((i) => i.decision === "REJECT");

  const calcLine = (i) => {
    const qty = Number(i.quantity || 0);
    const price = Number(i.newPrice || 0);
    const vatRate = Number(i.vatRate || 0);

    const net = qty * price;
    const vat = net * (vatRate / 100);
    return { net, vat, gross: net + vat };
  };

  const totals = accepted.reduce(
    (a, i) => {
      const c = calcLine(i);
      a.net += c.net;
      a.vat += c.vat;
      a.gross += c.gross;
      return a;
    },
    { net: 0, vat: 0, gross: 0 }
  );

  const hasAny = accepted.length > 0 || rejected.length > 0;

  return (
    <>
      <h2>İade Talebi Özeti</h2>

      <div style={{ marginBottom: "15px" }}>
        <strong>Müşteri:</strong> {data?.customer || "-"}
      </div>

      {!hasAny && <div>Gösterilecek satır bulunamadı.</div>}

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
                <th>Ürün</th>
                <th>Parti</th>
                <th>SKT / Satış Gün</th>
                <th>Adet</th>
                <th>Birim Fiyat</th>
                <th>KDV %</th>
                <th>KDV'siz Tutar</th>
              </tr>
            </thead>
            <tbody>
              {accepted.map((i, idx) => {
                const c = calcLine(i);
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{i.barcode || "-"}</td>
                    <td>{i.product || "-"}</td>
                    <td>{i.productName || "-"}</td>
                    <td>{i.lot || "-"}</td>
                    <td>{(i.messages || []).join(" / ")}</td>
                    <td>{i.quantity}</td>
                    <td>{Number(i.newPrice || 0).toFixed(2)}</td>
                    <td>{i.vatRate}</td>
                    <td>{c.net.toFixed(2)}</td>
                  </tr>
                );
              })}
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
                  <td>{i.barcode || "-"}</td>
                  <td>{i.product || "-"}</td>
                  <td>{i.lot || "-"}</td>
                  <td>{i.quantity}</td>
                  <td>{i.rejectNote || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ================= TOPLAMLAR (SADECE KABUL VARSA) ================= */}
      {accepted.length > 0 && (
        <div style={{ marginTop: "20px", width: "300px", marginLeft: "auto" }}>
          <div>Toplam Tutar: {totals.net.toFixed(2)}</div>
          <div>Toplam KDV: {totals.vat.toFixed(2)}</div>
          <strong>Toplam KDV’li Tutar: {totals.gross.toFixed(2)}</strong>
        </div>
      )}

      {/* ================= AKSİYONLAR ================= */}
      <div style={{ marginTop: "25px" }}>
        <button onClick={onBack}>Geri Dön</button>
        <button
          style={{ marginLeft: "10px" }}
          onClick={() =>
            onSave({
              requestNo: `IADE-${Date.now()}`,
              requestDate: new Date().toISOString().slice(0, 10),
              status: "OPEN",
              ...data,
              totals,
            })
          }
        >
          Kaydet
        </button>
      </div>
    </>
  );
}
