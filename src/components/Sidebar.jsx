export default function Sidebar({ setPage }) {
  return (
    <aside style={sidebar}>
      <h3>İade Platformu</h3>

        <button onClick={() => setPage("home")} style={btn}>Anasayfa</button>
        <button onClick={() => setPage("createReturn")} style={btn}>İade Talebi Oluştur</button>
        <button onClick={() => setPage("newProduct")} style={btn}>Yeni Ürün</button>
        <button onClick={() => setPage("newCustomer")} style={btn}>Yeni Müşteri</button>
        <button onClick={() => setPage("newReturnReason")} style={btn}>İade Sebebi Ekle</button> 
        <button onClick={() => setPage("returnQuery")} style={btn}>
        İade Sorgulama
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



