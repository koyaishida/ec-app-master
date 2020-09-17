import React from "react";
import { Switch, Route } from "react-router";
import {
  SignIn,
  SignUp,
  Reset,
  ProductEdit,
  ProductList,
  ProductDetail,
  CartList,
  OrderConfirm,
  OrderHistory,
  FavoriteList,
} from "./templates";
import Auth from "./Auth";

const Router = () => {
  return (
    <Switch>
      <Route exact path="/signUp" component={SignUp} />
      <Route exact path="/signIn" component={SignIn} />
      <Route exact path="/signIn/reset" component={Reset} />
      <Auth>
        <Route exact path="(/)?" component={ProductList} />
        {/* <Route path="/product/edit(/:id)?" component={ProductEdit} /> */}
        <Route path="/edit(/:id)?" component={ProductEdit} />
        <Route exact path="/product/:id" component={ProductDetail} />
        <Route exact path="/cart" component={CartList} />
        <Route exact path="/favorite" component={FavoriteList} />
        <Route exact path="/cart/confirm" component={OrderConfirm} />
        <Route exact path="/order/history" component={OrderHistory} />
      </Auth>
    </Switch>
  );
};

export default Router;
