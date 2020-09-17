import React, { FC, useCallback } from "react";
import { db, FirebaseTimeStamp } from "../../firebase";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Divider,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { Delete } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { getUserId } from "../../reducks/users/selectors";
import NoImage from "../../assets/img/src/no_image.png";
import { Product, SelectedProduct } from "../../reducks/products/types";
import { addProductToCart } from "../../reducks/users/operations";
import { ShoppingCart } from "@material-ui/icons";

const useStyles = makeStyles({
  List: {
    height: 128,
  },
  image: {
    objectFit: "cover",
    margin: 16,
    height: 96,
    width: 96,
  },
  text: {
    width: "100%",
  },
});

type ProductInFavoriteProps = {
  productInFavorite: SelectedProduct;
};

const FavoriteListItem: FC<ProductInFavoriteProps> = (props) => {
  const classes = useStyles();
  const image =
    props.productInFavorite.images.length > 0
      ? props.productInFavorite.images[0].path
      : NoImage;

  const price = props.productInFavorite.price.toLocaleString();

  const {
    name,
    size,
    favoriteId,
    description,
    productId,
  } = props.productInFavorite;
  const selector = useSelector((state) => state);
  const dispatch = useDispatch();
  const uid = getUserId(selector);

  const removeProduct = (id: string) => {
    return db
      .collection("users")
      .doc(uid)
      .collection("favorite")
      .doc(id)
      .delete();
  };

  const addProduct = useCallback(
    (selectedSize) => {
      const timestamp = FirebaseTimeStamp.now();
      dispatch(
        addProductToCart({
          added_at: timestamp,
          description: description,
          images: props.productInFavorite.images,
          name: name,
          price: props.productInFavorite.price,
          productId: productId,
          quantity: 1,
          size: selectedSize,
          cartId: "",
          favoriteId: "",
        })
      );
    },
    [props.productInFavorite]
  );

  return (
    <>
      <ListItem className={classes.List}>
        <ListItemAvatar>
          <img className={classes.image} src={image} alt="商品画像" />
        </ListItemAvatar>
        <div className={classes.text}>
          <ListItemText primary={name} secondary={`サイズ ${size.size}`} />
          <ListItemText primary={price} />
        </div>
        <IconButton onClick={() => addProduct(size)}>
          <ShoppingCart />
        </IconButton>

        <IconButton onClick={() => removeProduct(favoriteId)}>
          <Delete />
        </IconButton>
      </ListItem>
      <Divider />
    </>
  );
};

export default FavoriteListItem;
