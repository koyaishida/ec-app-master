import "react-redux";
import { RouterState } from "connected-react-router";

export type StoreState = {
  products: {
    list: [];
  };
  users: {
    cart: [];
    favorite: [];
    order: [];
    isSignedIn: false;
    uid: string;
    username: string;
  };
  router: RouterState;
};

declare module "react-redux" {
  interface DefaultRootState extends StoreState {}
}
