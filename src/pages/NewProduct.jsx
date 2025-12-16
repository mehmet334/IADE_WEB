import { useState } from "react";

export default function NewProduct({ products, setProducts }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const saveProduct = () => {
    if (!name || !code) return alert("Zorunlu alan");

    setProducts([...products, { id: Date.now(), name, code }]);
    setName("");
    setCode("");
  };

  return (
    <>
      <h2>Yeni Ürün</h2>

      <input placeholder="Ürün adı" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Ürün kodu" value={code} onChange={e => setCode(e.target.value)} />

      <br /><br />
      <button onClick={saveProduct}>Kaydet</button>

      <ul>
        {products.map(p => (
          <li key={p.id}>{p.code} - {p.name}</li>
        ))}
      </ul>
    </>
  );
}
