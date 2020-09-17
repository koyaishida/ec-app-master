import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsInFavorite } from "../reducks/users/selectors";
import { List } from "@material-ui/core/";
import { FavoriteListItem } from "../components/Products";
import { PrimaryButton, GrayButton } from "../components/UIkit";
import { push } from "connected-react-router";
import { makeStyles } from "@material-ui/styles";
import { SelectedProduct } from "../reducks/products/types";

const useStyles = makeStyles({
  root: {
    margin: "0 auto",
    maxWidth: 512,
    width: "100%",
  },
});

const FavoriteList = () => {
  const selector = useSelector((state) => state);

  const productsInFavorite = getProductsInFavorite(selector);
  const dispatch = useDispatch();
  const classes = useStyles();

  const goToOrder = useCallback(() => {
    dispatch(push("/cart/confirm"));
  }, []);

  const goToHome = useCallback(() => {
    dispatch(push("/"));
  }, []);

  return (
    <section className="c-section-wrapin">
      <h2 className="u-text__headline">お気に入り一覧</h2>
      <List className={classes.root}>
        {productsInFavorite.length > 0 &&
          productsInFavorite.map(
            (productInFavorite: SelectedProduct, index: number) => (
              <FavoriteListItem
                productInFavorite={productInFavorite}
                key={index}
              />
            )
          )}
      </List>
      <div className="module-spacer--medium" />
      <div className="module-spacer-extra-small" />
      <GrayButton label={"ショッピングを続ける"} onClick={goToHome} />
    </section>
  );
};

export default FavoriteList;
