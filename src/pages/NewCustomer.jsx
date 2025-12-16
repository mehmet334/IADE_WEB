import { useState } from "react";

export default function NewCustomer({ customers, setCustomers }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!code || !name) {
      alert("Müşteri kodu ve adı zorunlu");
      return;
    }

    setCustomers([
      ...customers,
      {
        id: customers.length + 1,
        code,
        name
      }
    ]);

    setCode("");
    setName("");
  };

  return (
    <>
      <h2>Yeni Müşteri</h2>

      <input
        placeholder="Müşteri Kodu"
        value={code}
        onChange={e => setCode(e.target.value)}
      />

      <input
        placeholder="Müşteri Adı"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ marginLeft: "10px" }}
      />

      <button onClick={handleSave} style={{ marginLeft: "10px" }}>
        Kaydet
      </button>

      <hr />

      <ul>
        {customers.map(c => (
          <li key={c.id}>
            {c.code} - {c.name}
          </li>
        ))}
      </ul>
    </>
  );
}
