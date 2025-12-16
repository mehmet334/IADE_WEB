export default function ReturnItemRow({
  item,
  products,
  checked,
  result,
  onItemChange,
  onResultChange
}) {
  return (
    <div style={row}>
      {/* ÜRÜN */}
      <select
        disabled={checked}
        value={item.product}
        onChange={e => onItemChange("product", e.target.value)}
      >
        <option value="">Ürün seç</option>
        {products.map(p => (
          <option key={p.id} value={p.code}>
            {p.code} - {p.name}
          </option>
        ))}
      </select>

      {/* PARTİ */}
      <input
        disabled={checked}
        placeholder="Parti"
        value={item.lot}
        onChange={e => onItemChange("lot", e.target.value)}
      />

      {/* ADET */}
      <input
        disabled={checked}
        type="number"
        placeholder="Adet"
        value={item.quantity}
        onChange={e => onItemChange("quantity", e.target.value)}
      />

      {/* KONTROL SONUÇLARI */}
      {checked && result && (
        <div style={{ gridColumn: "1 / -1", marginTop: "8px" }}>
          {result.message.map((m, i) => (
            <div key={i}>{m}</div>
          ))}

          {/* YENİ FİYAT GİR */}
          {result.approvalRequired && !result.priceApproved && (
            <div style={{ marginTop: "6px", display: "flex", gap: "8px" }}>
              <input
                type="number"
                placeholder="Yeni fiyat gir"
                value={result.newPrice}
                onChange={e =>
                  onResultChange("newPrice", e.target.value)
                }
              />
              <button
                onClick={() => {
                  if (!result.newPrice) {
                    alert("Yeni fiyat girilmelidir");
                    return;
                  }
                  onResultChange("priceApproved", true);
                }}
              >
                Fiyat OK
              </button>
            </div>
          )}

          {result.priceApproved && (
            <div style={{ color: "green", fontWeight: "bold", marginTop: "4px" }}>
              ✔️ Fiyat onaylandı
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const row = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr",
  gap: "10px",
  marginBottom: "10px"
};
