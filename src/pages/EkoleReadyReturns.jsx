import { createEkolExcel } from "../utils/ekolExcel";
import { useState } from "react";

export default function EkoleReadyReturns({ returns }) {
  
  
    const [selected, setSelected] = useState([]);

  const toggleSelect = (r) => {
    setSelected((prev) =>
      prev.includes(r)
        ? prev.filter((x) => x !== r)
        : [...prev, r]
    );
  };

  const handleCreateTemplates = () => {
    if (selected.length === 0) {
      alert("En az bir iade seçmelisiniz");
      return;
    }

    selected.forEach((r) => {
      const fileName =
        `${r.customerName}-${r.items[0].productName}-${r.invoiceNo.slice(-3)}`;

      createEkolExcel(r, fileName);
    });
  };

  return (
    <>
      <h2>Ekole Gönderilebilir İadeler</h2>

      <table border="1" width="100%" cellPadding="6">
        <thead>
          <tr>
            <th></th>
            <th>İade No</th>
            <th>Dosya Adı</th>
            <th>Müşteri</th>
            <th>Toplam</th>
          </tr>
        </thead>
        <tbody>
          {returns
            .filter(r => r.status === "READY_FOR_EKOL")
            .map((r, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(r)}
                    onChange={() => toggleSelect(r)}
                  />
                </td>
                <td>{r.requestNo}</td>
                <td>
                  {`${r.customerName}-${r.items[0].productName}-${r.invoiceNo.slice(-3)}`}
                </td>
                <td>{r.customerName}</td>
                <td>{r.totalGross.toFixed(2)}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleCreateTemplates}>
          Şablon Oluştur
        </button>
      </div>
    </>
  );
}
