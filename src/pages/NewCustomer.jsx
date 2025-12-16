import { useState } from "react";

export default function NewCustomer({ customers, setCustomers }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const saveCustomer = () => {
    if (!name || !code) return alert("Zorunlu alan");

    setCustomers([...customers, { id: Date.now(), name, code }]);
    setName("");
    setCode("");
  };

  return (
    <>
      <h2>Yeni Müşteri</h2>

      <input placeholder="Müşteri adı" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Müşteri kodu" value={code} onChange={e => setCode(e.target.value)} />

      <br /><br />
      <button onClick={saveCustomer}>Kaydet</button>

      <ul>
        {customers.map(c => (
          <li key={c.id}>{c.code} - {c.name}</li>
        ))}
      </ul>
    </>
  );
}
