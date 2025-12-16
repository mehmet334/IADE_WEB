export default function ReturnItemRow({
  item,
  products,
  checked,
  result,
  onItemChange,
  onResultChange
  
}) {
  const r = result || {};

  return (
    <div style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "8px" }}>
      
      {/* NORMAL GİRİŞ ALANLARI – HER ZAMAN GÖRÜNÜR */}
      <select
        value={item.product}
        onChange={e => onItemChange("product", e.target.value)}
        disabled={checked}
      >
        <option value="">Ürün seçiniz</option>
        {products.map(p => (
          <option key={p.code} value={p.code}>
            {p.code} - {p.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Parti"
        value={item.lot}
        onChange={e => onItemChange("lot", e.target.value)}
        disabled={checked}
      />

      <input
        placeholder="Adet"
        type="number"
        value={item.quantity}
        onChange={e => onItemChange("quantity", e.target.value)}
        disabled={checked}
      />

      <input
        placeholder="Not"
        value={item.note}
        onChange={e => onItemChange("note", e.target.value)}
        disabled={checked}
      />

      {/* KONTROL SONRASI BİLGİLER */}
      {checked && (
        <div style={{ marginTop: "8px", background: "#f9f9f9", padding: "8px" }}>
          {r.messages?.map((m, i) => (
            <div key={i}>• {m}</div>
          ))}

          <div style={{ marginTop: "5px" }}>
            <input
              type="number"
              value={r.newPrice || ""}
              onChange={e => onResultChange("newPrice", e.target.value)}
            />
            <span> TRY</span>
          </div>

          <div style={{ marginTop: "5px" }}>
            <button
              onClick={() => onResultChange("decision", "ACCEPT")}
              style={{
                background: r.decision === "ACCEPT" ? "#c8f7c5" : ""
              }}
            >
              Kabul
            </button>

            <button
              onClick={() => onResultChange("decision", "REJECT")}
              style={{
                marginLeft: "5px",
                background: r.decision === "REJECT" ? "#f7c5c5" : ""
              }}
            >
              Red
            </button>
          </div>

          {r.decision === "REJECT" && (
            <input
              placeholder="Red Notu"
              value={r.rejectNote || ""}
              onChange={e => onResultChange("rejectNote", e.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );
}