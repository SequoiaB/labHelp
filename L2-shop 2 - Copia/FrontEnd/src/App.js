/// import vecchi
import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import { Switch, Route } from "react-router-dom";
import Products from "./components/Products";
import Product from "./components/Product";
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import Prova from "./components/Prova";
import Orders from "./components/Orders";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./components/theme";
//import nuovi
import React from "react";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/products" component={Products} />
          <Route exact path="/products/:id" component={Product} />
          <Route exact path="/cart" component={Cart} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/profile/:view" component={Profile} />
          <Route exact path="/prova" component={Prova} />
          <Route exact path="/orders" component={Orders} />
        </Switch>
      </ThemeProvider>
    </>
  );
}

export default App;
