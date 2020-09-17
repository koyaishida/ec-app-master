import {
  signInAction,
  signOutAction,
  fetchProductsInCartAction,
  fetchProductsInFavoriteAction,
  fetchOrderHistoryAction,
  Actions,
} from "./actions";
import { push } from "connected-react-router";
import { auth, FirebaseTimeStamp, db } from "../../firebase/index";
import {
  Product,
  SelectedProduct,
  OrdersHistory,
  OrderedProduct,
} from "../products/types";
import { Dispatch } from "redux";
import { StoreState } from "../store/types";

export const addProductToCart = (addedProduct: SelectedProduct) => {
  return async (dispatch: Dispatch, getState: () => StoreState) => {
    const uid = getState().users.uid;
    const cartRef = db.collection("users").doc(uid).collection("cart").doc();
    addedProduct.cartId = cartRef.id;
    await cartRef.set(addedProduct);
    dispatch(push("/"));
  };
};

export const fetchProductsInCart = (products: SelectedProduct[]) => {
  return async (dispatch: Dispatch<Actions>) => {
    dispatch(fetchProductsInCartAction(products));
  };
};

export const addProductToFavorite = (addedProduct: SelectedProduct) => {
  return async (dispatch: Dispatch, getState: () => StoreState) => {
    const uid = getState().users.uid;
    const favoriteRef = db
      .collection("users")
      .doc(uid)
      .collection("favorite")
      .doc();

    addedProduct.favoriteId = favoriteRef.id;
    await favoriteRef.set(addedProduct);
    dispatch(push("/"));
  };
};

export const fetchProductsInFavorite = (products: SelectedProduct[]) => {
  return async (dispatch: Dispatch<Actions>) => {
    dispatch(fetchProductsInFavoriteAction(products));
  };
};

export const fetchOrderHistory = () => {
  return async (dispatch: Dispatch<Actions>, getState: () => StoreState) => {
    const orderList: OrdersHistory[] = [];
    const uid = getState().users.uid;
    db.collection("users")
      .doc(uid)
      .collection("orders")
      .get()
      .then((snapshots) => {
        snapshots.forEach((snapshot) => {
          const data = snapshot.data() as OrdersHistory;
          orderList.push(data);
        });
        dispatch(fetchOrderHistoryAction(orderList));
      });
  };
};

export const listenAuthState = () => {
  return async (dispatch: Dispatch) => {
    return auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;

        db.collection("users")
          .doc(uid)
          .get()
          .then((snapshot) => {
            const data = snapshot.data();

            if (data === undefined) {
              return null;
            }

            dispatch(
              signInAction({
                isSignedIn: true,
                uid: uid,
                username: data.username,
              })
            );
          });
        console.log("ログインずみ");
      } else {
        console.log("弾かれた");
        dispatch(push("/signIn"));
      }
    });
  };
};

export const signIn = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    if (email === "" || password === "") {
      alert("必須項目が未入力です。");
      return false;
    }

    auth.signInWithEmailAndPassword(email, password).then((result) => {
      const user = result.user;

      if (user) {
        const uid = user.uid;

        db.collection("users")
          .doc(uid)
          .get()
          .then((snapshot) => {
            const data = snapshot.data();

            if (data === undefined) {
              return null;
            }

            dispatch(
              signInAction({
                isSignedIn: true,
                uid: uid,
                username: data.username,
              })
            );

            dispatch(push("/"));
          });
      }
    });
  };
};

export const signUp = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  return async (dispatch: Dispatch) => {
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      alert("必須項目が未入力です。");
      return false;
    }

    if (password !== confirmPassword) {
      alert("パスワードが一致しません。もう一度お試し下さい");
      return false;
    }

    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const user = result.user;

        if (user) {
          const uid = user.uid;
          const timestamp = FirebaseTimeStamp.now();

          const userInitialData = {
            created_at: timestamp,
            email: email,
            uid: uid,
            updated_at: timestamp,
            username: username,
          };

          db.collection("users")
            .doc(`${uid}`)
            .set(userInitialData)
            .then(() => {
              dispatch(push("/"));
            });
        }
      });
  };
};

export const signOut = () => {
  return async (dispatch: Dispatch) => {
    auth.signOut().then(() => {
      dispatch(signOutAction());
      dispatch(push("/signIn"));
    });
  };
};

export const ResetPassword = (email: string) => {
  return async (dispatch: Dispatch) => {
    if (email === "") {
      alert("必須項目が未入力です");
      return false;
    } else {
      auth
        .sendPasswordResetEmail(email)
        .then(() => {
          alert(
            "入力されたメールアドレスにパスワードリセット用のメールを送信しました"
          );
          dispatch(push("/signIn"));
        })
        .catch(() => {
          alert("パスワードリセットに失敗しました。再度お試しください");
        });
    }
  };
};
