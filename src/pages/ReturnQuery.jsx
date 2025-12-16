import { useState } from "react";
import ReturnDetail from "./ReturnDetail";

export default function ReturnQuery({ returnRequests }) {
  /* ================= INITIAL STATE ================= */

  const initialOpenReturns = returnRequests.filter(
    r => r.status === "OPEN"
  );

  const [mode, setMode] = useState("OPEN"); // OPEN | MONTH
  const [selectedMonth, setSelectedMonth] = useState("");
  const [results, setResults] = useState(initialOpenReturns);
  const [selectedReturn, setSelectedReturn] = useState(null);

  /* ================= ACTIONS ================= */

  const handleOpenReturns = () => {
    setMode("OPEN");
    setResults(returnRequests.filter(r => r.status === "OPEN"));
  };

  const handleMonthlyReturns = () => {
    if (!selectedMonth) {
      alert("Ay-Yıl seçiniz");
      return;
    }

    setMode("MONTH");
    setResults(
      returnRequests.filter(r =>
        r.requestDate.startsWith(selectedMonth)
      )
    );
  };

  /* ================= RENDER ================= */

  return (
    <>
      <h2>İade Sorgulama</h2>

      {/* -------- ÜST KONTROLLER -------- */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button onClick={handleOpenReturns}>
          Açık İade Talepleri
        </button>

        <button onClick={handleMonthlyReturns}>
          Ay Bazlı İade Talepleri
        </button>

        <input
          type="month"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
        {mode === "OPEN"
          ? "Açık İade Talepleri"
          : `Ay Bazlı İade Talepleri (${selectedMonth})`}
      </div>

      <hr />

      {/* -------- DETAY -------- */}
      {selectedReturn && (
        <ReturnDetail
          data={selectedReturn}
          onClose={() => setSelectedReturn(null)}
        />
      )}

      {/* -------- TABLO -------- */}
      {results.length === 0 ? (
        <div>Kayıt bulunamadı</div>
      ) : (
        <table
          border="1"
          cellPadding="6"
          width="100%"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Talep No</th>
              <th>Talep Tarihi</th>
              <th>Müşteri</th>
              <th>Durum</th>
              <th>Toplam (KDV’li)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr
                key={i}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedReturn(r)}
              >
                <td>{r.requestNo}</td>
                <td>{r.requestDate}</td>
                <td>{r.customerCode}</td>
                <td>{r.status === "OPEN" ? "Açık" : "Kapalı"}</td>
                <td style={{ textAlign: "right" }}>
                  {(r.totalGross || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
