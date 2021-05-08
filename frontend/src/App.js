import Login from "./components/Login";
import Register from "./components/Register";
import homePage from "./components/HomePage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/homepage" component={homePage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
