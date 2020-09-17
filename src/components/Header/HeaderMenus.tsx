import React, { useEffect, FC, useCallback } from "react";
import { IconButton, Badge } from "@material-ui/core";
import { ShoppingCart, FavoriteBorder, Menu } from "@material-ui/icons";
import {
  getProductsInCart,
  getUserId,
  getProductsInFavorite,
} from "../../reducks/users/selectors";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../../firebase";
import {
  fetchProductsInCart,
  fetchProductsInFavorite,
} from "../../reducks/users/operations";
import { push } from "connected-react-router";
import { Product, SelectedProduct } from "../../reducks/products/types";

type HeaderMenusProps = {
  handleDrawerToggle: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
};

const HeaderMenus: FC<HeaderMenusProps> = (props) => {
  const selector = useSelector((state) => state);
  //ここ確認
  let productsInCart: SelectedProduct[];
  productsInCart = getProductsInCart(selector);

  let productsInFavorite: SelectedProduct[];
  productsInFavorite = getProductsInFavorite(selector);
  const uid = getUserId(selector);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(uid)
      .collection("favorite")
      .onSnapshot((snapshots) => {
        snapshots.docChanges().forEach((change) => {
          const product = change.doc.data() as SelectedProduct;
          const changeType = change.type;

          switch (changeType) {
            case "added":
              productsInFavorite.push(product);
              break;
            case "modified":
              const index = productsInFavorite.findIndex(
                (product: SelectedProduct) =>
                  product.favoriteId === change.doc.id
              );
              productsInFavorite[index] = product;
              break;
            case "removed":
              productsInFavorite = productsInFavorite.filter(
                (product: SelectedProduct) =>
                  product.favoriteId !== change.doc.id
              );
              break;
            default:
              break;
          }
        });

        dispatch(fetchProductsInFavorite(productsInFavorite));
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(uid)
      .collection("cart")
      .onSnapshot((snapshots) => {
        snapshots.docChanges().forEach((change) => {
          const product = change.doc.data() as SelectedProduct;
          const changeType = change.type;

          switch (changeType) {
            case "added":
              productsInCart.push(product);
              break;
            case "modified":
              const index = productsInCart.findIndex(
                (product: SelectedProduct) => product.cartId === change.doc.id
              );
              productsInCart[index] = product;
              break;
            case "removed":
              productsInCart = productsInCart.filter(
                (product: SelectedProduct) => product.cartId !== change.doc.id
              );
              break;
            default:
              break;
          }
        });
        dispatch(fetchProductsInCart(productsInCart));
      });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <IconButton onClick={() => dispatch(push("/cart"))}>
        <Badge
          badgeContent={productsInCart ? productsInCart.length : 0}
          color="secondary"
        />
        <ShoppingCart />
      </IconButton>

      <IconButton onClick={() => dispatch(push("/favorite"))}>
        <Badge
          badgeContent={productsInFavorite ? productsInFavorite.length : 0}
          color="secondary"
        />
        <FavoriteBorder />
      </IconButton>

      <IconButton onClick={(event) => props.handleDrawerToggle(event)}>
        <Menu />
      </IconButton>
    </>
  );
};

export default HeaderMenus;
