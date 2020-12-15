import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import store from "./store";

function App() {
  return (
    <div className="container">
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/signup" component={SignupPage} />
            <Route exact path="/" component={HomePage} />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
