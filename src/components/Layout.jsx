import Sidebar from "./Sidebar";

export default function Layout({ children, setPage }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar setPage={setPage} />
      <main style={{ flex: 1, padding: "30px" }}>
        {children}
      </main>
    </div>
  );
}