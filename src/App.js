import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home, Error, Dashboard } from "./pages";
import Transfer from "./pages/Transfer";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { useGlobalContext } from "./context";
function App() {
  const { isLoading } = useGlobalContext();
  if (isLoading) {
    return (
      <section className="page page-center">
        <div className="loading"></div>
      </section>
    );
  }
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/transfer" exact>
          <Transfer />
        </Route>
        <Route path="/deposit" exact>
          <Deposit />
        </Route>
        <Route path="/withdraw" exact>
          <Withdraw />
        </Route>
        <Route path="/dashboard" exact>
          <Dashboard />
        </Route>
        <Route path="*">
          <Error />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
