import { useState } from "react";

export default function NewProduct({ products, setProducts }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!code || !name) {
      alert("Ürün kodu ve adı zorunlu");
      return;
    }

    setProducts([
      ...products,
      {
        id: products.length + 1,
        code,
        name,
        vatRate: 10,
        unit: "Kutu"
      }
    ]);

    setCode("");
    setName("");
  };

  return (
    <>
      <h2>Yeni Ürün</h2>

      <input
        placeholder="Ürün Kodu"
        value={code}
        onChange={e => setCode(e.target.value)}
      />

      <input
        placeholder="Ürün Adı"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ marginLeft: "10px" }}
      />

      <button onClick={handleSave} style={{ marginLeft: "10px" }}>
        Kaydet
      </button>

      <hr />

      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.code} - {p.name}
          </li>
        ))}
      </ul>
    </>
  );
}
