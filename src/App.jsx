import { useState } from "react";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import CreateReturn from "./pages/CreateReturn";
import ReturnSummary from "./pages/ReturnSummary";
import ReturnQuery from "./pages/ReturnQuery";
import EkoleReadyReturns from "./pages/EkoleReadyReturns";

import NewProduct from "./pages/NewProduct";
import NewCustomer from "./pages/NewCustomer";
import NewReturnReason from "./pages/NewReturnReason";

import { mockCustomers } from "./data/mockCustomers";
import { mockProducts } from "./data/mockProducts";
import { mockReturnReasons } from "./data/mockReturnReasons";

function App() {
  const [page, setPage] = useState("home");

const [customers, setCustomers] = useState(mockCustomers);
const [products, setProducts] = useState(mockProducts);
const [returnReasons, setReturnReasons] = useState(mockReturnReasons);


  const [draftReturn, setDraftReturn] = useState(null);

const [allReturns, setAllReturns] = useState([
  {
    requestNo: "IADE-2025-0012",
    requestDate: "2025-01-14",
    customerName: "BEK Bursa",
    status: "READY_FOR_EKOL",
    invoiceNo: "EF-2025-004935",
    invoiceDate: "2025-01-13",
    sapOrderNo: "4500123456",
    sapDeliveryNo: "80004567",
    totalGross: 8750,
    items: [
      {
        productCode: "15011246001",
        productName: "EMLA KREM %5",
        quantity: 9,
        lot: "PARTI001",
        skt: "2026-11-12",
        returnReason: "RAF ÖMRÜ"
      }
    ]
  }
]);



  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} />

      <main style={{ padding: "20px", flex: 1 }}>
        <div style={{ marginBottom: "10px", color: "#888" }}>
          Aktif Sayfa: <strong>{page}</strong>
        </div>

        {page === "home" && <Home />}

        {page === "createReturn" && (
          <CreateReturn
            customers={customers}
            products={products}
            returnReasons={returnReasons}
            onContinue={(draft) => {
              setDraftReturn(draft);
              setPage("returnSummary");
            }}
          />
        )}

        {page === "returnSummary" && draftReturn && (
          <ReturnSummary
            data={draftReturn}
            onBack={() => setPage("createReturn")}
            onSave={(saved) => {
              setAllReturns((prev) => [...prev, saved]);
              setDraftReturn(null);
              setPage("home");
            }}
          />
        )}

        {page === "returnQuery" && (
          <ReturnQuery returnRequests={allReturns} />
        )}

       {page === "ekolReady" && (
  <EkoleReadyReturns returns={allReturns} />
)}

{page === "newProduct" && (
  <NewProduct
    products={products}
    setProducts={setProducts}
  />
)}

{page === "newCustomer" && (
  <NewCustomer
    customers={customers}
    setCustomers={setCustomers}
  />
)}

{page === "newReturnReason" && (
  <NewReturnReason
    returnReasons={returnReasons}
    setReturnReasons={setReturnReasons}
  />
)}


      </main>
    </div>
  );
}

export default App;
