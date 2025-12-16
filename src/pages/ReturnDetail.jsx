import { useState } from "react";

export default function ReturnDetail({ data, onClose }) {
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState(data.status);
  const [dirty, setDirty] = useState(false);

  const handleStatusChange = e => {
    setStatus(e.target.value);
    setDirty(true);
  };

  const handleSave = () => {
    console.log("UPDATED RETURN:", {
      requestNo: data.requestNo,
      status
    });

    alert("İade güncellendi");
    setDirty(false);
    setEditMode(false);
  };

  return (
    <div style={box}>
      <h3>İade Talebi Detayı</h3>

      <div><b>Talep No:</b> {data.requestNo}</div>
      <div><b>Talep Tarihi:</b> {data.requestDate}</div>
      <div><b>Müşteri:</b> {data.customerCode}</div>

      <hr />

      <div>
        <label><b>Durum:</b></label>{" "}
        <select
          value={status}
          disabled={!editMode}
          onChange={handleStatusChange}
        >
          <option value="OPEN">Açık</option>
          <option value="CLOSED">Kapalı</option>
        </select>
      </div>

      <div style={{ marginTop: "20px" }}>
        {!editMode ? (
          <button onClick={() => setEditMode(true)}>Düzelt</button>
        ) : (
          <>
            <button onClick={handleSave} disabled={!dirty}>
              Kaydet
            </button>
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => {
                setEditMode(false);
                setStatus(data.status);
                setDirty(false);
              }}
            >
              Vazgeç
            </button>
          </>
        )}

        <button style={{ marginLeft: "10px" }} onClick={onClose}>
          Kapat
        </button>
      </div>
    </div>
  );
}

const box = {
  border: "1px solid #ccc",
  padding: "20px",
  marginBottom: "20px",
  background: "#fafafa"
};
