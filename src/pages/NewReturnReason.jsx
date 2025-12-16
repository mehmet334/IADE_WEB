import { useState } from "react";

export default function NewReturnReason({ returnReasons, setReturnReasons }) {
  const [name, setName] = useState("");

  const saveReason = () => {
    if (!name) {
      alert("İade sebebi girilmelidir");
      return;
    }

    const nextId =
      returnReasons.length === 0
        ? 1
        : Math.max(...returnReasons.map(r => r.id)) + 1;

    setReturnReasons([
      ...returnReasons,
      {
        id: nextId,
        name
      }
    ]);

    setName("");
  };

  return (
    <div>
      <h2>İade Sebebi Ekle</h2>

      {/* FORM */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          placeholder="İade sebebi açıklaması"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <button onClick={saveReason}>Kaydet</button>
      </div>

      <hr />

      {/* LİSTE */}
      <h4>Tanımlı İade Sebepleri</h4>

      {returnReasons.length === 0 ? (
        <p>Henüz tanımlı iade sebebi yok.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>Açıklama</th>
            </tr>
          </thead>
          <tbody>
            {returnReasons.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
