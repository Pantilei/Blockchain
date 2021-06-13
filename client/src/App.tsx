import { SearchAppBar } from "./components/AppBar";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { routes } from "./routes";
const App: React.FC = () => {
  return (
    <Router>
      <SearchAppBar />
      <Switch>
        {routes.map((route, index) => {
          return (
            <Route key={index} path={route.path} exact={route.exact}>
              <route.component />
            </Route>
          );
        })}
      </Switch>
    </Router>
  );
};

export default App;
