export default function Sidebar({ setPage }) {
  return (
    <aside style={sidebar}>
      <h3>İade Platformu</h3>

      <button style={btn} onClick={() => setPage("home")}>
        Anasayfa
      </button>

      <button style={btn} onClick={() => setPage("createReturn")}>
        İade Talebi Oluştur
      </button>

      <button style={btn} onClick={() => setPage("returnQuery")}>
        İade Sorgulama
      </button>

      <button style={btn} onClick={() => setPage("newProduct")}>
        Yeni Ürün
      </button>

      <button style={btn} onClick={() => setPage("newCustomer")}>
        Yeni Müşteri
      </button>

      <button style={btn} onClick={() => setPage("newReturnReason")}>
        İade Sebebi Ekle
      </button>
<button style={btn} onClick={() => setPage("ekolReady")}>
  Ekole Gönderilebilir İadeler
</button>
    </aside>
  );
}

const sidebar = {
  width: "220px",
  borderRight: "1px solid #ddd",
  padding: "20px"
};

const btn = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  cursor: "pointer"
};
