import { useState } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CreateReturn from "./pages/CreateReturn";
import NewProduct from "./pages/NewProduct";
import NewCustomer from "./pages/NewCustomer";
import NewReturnReason from "./pages/NewReturnReason";
import ReturnQuery from "./pages/ReturnQuery";
function App() {
  const [page, setPage] = useState("home");

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [returnReasons, setReturnReasons] = useState([]);

  return (
    <Layout setPage={setPage}>
      {page === "home" && <Home />}

      {page === "createReturn" && (
        <CreateReturn
          products={products}
          customers={customers}
          returnReasons={returnReasons}
        />
      )}

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

      {page === "returnQuery" && <ReturnQuery />}
    </Layout>
  );
}

export default App;
