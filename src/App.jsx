import { useState } from "react";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import CreateReturn from "./pages/CreateReturn";
import ReturnQuery from "./pages/ReturnQuery";
import NewProduct from "./pages/NewProduct";
import NewCustomer from "./pages/NewCustomer";
import NewReturnReason from "./pages/NewReturnReason";

import { mockCustomers } from "./data/mockCustomers";
import { mockProducts } from "./data/mockProducts";
import { mockReturnReasons } from "./data/mockReturnReasons";
import ReturnSummary from "./pages/ReturnSummary";

function App() {
  const [page, setPage] = useState("home");
  const [draftReturn, setDraftReturn] = useState(null);
  // 🔹 MERKEZİ STATE (geçici DB)
  const [customers, setCustomers] = useState(mockCustomers);
  const [products, setProducts] = useState(mockProducts);
  const [returnReasons, setReturnReasons] = useState(mockReturnReasons);
  const [returnRequests, setReturnRequests] = useState([]);
  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} />

      <main style={{ padding: "20px", flex: 1 }}>
        {page === "home" && <Home />}


          {page === "createReturn" && (
            <CreateReturn
              customers={customers}
              products={products}
              returnReasons={returnReasons}
            onContinue={(draft) => {
            console.log("APP ONCONTINUE", draft);
            setDraftReturn(draft);
            setPage("returnSummary");
              }}
            />
          )}
          {page === "returnSummary" && (
            <ReturnSummary
              data={draftReturn}
              onBack={() => setPage("createReturn")}
              onSave={(finalReturn) => {
                setReturnRequests(prev => [...prev, finalReturn]);
                setPage("home");
              }}
            />
          )}
        {page === "returnQuery" && <ReturnQuery returnRequests={returnRequests} />}

        {page === "newProduct" && (
          <NewProduct products={products} setProducts={setProducts} />
        )}

        {page === "newCustomer" && (
          <NewCustomer customers={customers} setCustomers={setCustomers} />
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
