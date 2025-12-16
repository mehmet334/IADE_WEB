import { useState } from "react";

export default function NewReturnReason({ returnReasons, setReturnReasons }) {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!name) {
      alert("Sebep adı zorunlu");
      return;
    }

    setReturnReasons([
      ...returnReasons,
      {
        id: returnReasons.length + 1,
        name
      }
    ]);

    setName("");
  };

  return (
    <>
      <h2>İade Sebebi Ekle</h2>

      <input
        placeholder="İade Sebebi"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <button onClick={handleSave} style={{ marginLeft: "10px" }}>
        Kaydet
      </button>

      <hr />

      <ul>
        {returnReasons.map(r => (
          <li key={r.id}>
            {r.id} - {r.name}
          </li>
        ))}
      </ul>
    </>
  );
}
