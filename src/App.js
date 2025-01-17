import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks"

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
      <nav>
        <Switch>
          <Route exact path="/"><Products/></Route>
          <Route path="/login"><Login/></Route>
          <Route path="/register"><Register/></Route>
          <Route path="/checkout"><Checkout/></Route>
          <Route path="/thanks"><Thanks/></Route>
        </Switch>
      </nav>
      {/* <Register/> */}
      {/* <Login /> */}
      {/* <ThemeProvider theme={theme}></ThemeProvider> */}
    </div>
  );
}

export default App;
