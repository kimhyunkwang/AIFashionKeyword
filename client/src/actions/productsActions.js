import { ProductActionTypes } from './types';
import axios from 'axios';
import { tokenConfig } from './auth';
import baseUrl from '../url';

const orderApiUrl = `${baseUrl}api/order/`;
const cartApiUrl = `${baseUrl}api/user/cart/`;
const likesApiUrl = `${baseUrl}api/user/like/`;
// const categories = [
//   'outer',
//   'top',
//   'bottom',
//   'set',
//   'sports',
//   'etc',
//   'shoes',
//   'bag',
//   'accessories',
// ];

export const setProducts = () => (dispatch, getstate) => {
  axios
    .get(
      'http://elice-kdt-ai-track-vm-distribute-22.koreacentral.cloudapp.azure.com:8000/api/item/recommendation?keywords=love,cheap&categories=top,bottom',
      tokenConfig(getstate),
    )
    .then((res) => {
      console.log('Success!!:', res.data);
    })
    .catch((err) => {
      console.log('Fail!!:', err.response);
    });

  axios
    .get('https://fakestoreapi.com/products')
    .then((res) => {
      const productData = getstate().setProductsReducer.products;
      const categoryData = [];

      console.log(res.data);
      res.data.map((data) => {
        if (data.category == "women's clothing") {
          productData.outer.push(data);
        } else if (data.category == "men's clothing") {
          productData.top.push(data);
        } else if (data.category == 'jewelery') {
          productData.bottom.push(data);
        }
      });

      // res.data.map((data) => {
      //   productData[data.category] = [...productData[data.category], data];
      // });

      console.log(productData);

      Object.entries(productData).map(([category, productList]) => {
        console.log(category, productList);
        if (!productList) {
        } else if (productList.length !== 0) {
          categoryData.push(category);
        }
      });

      console.log('categoryData:', categoryData);
      dispatch({
        type: ProductActionTypes.SET_PRODUCTS,
        payload: { ...productData },
      });
      dispatch({
        type: ProductActionTypes.SET_CATEGORY,
        payload: [...categoryData],
      });
    })
    .catch((err) => {
      console.log('Err: ', err.response);
    });
};

export const selectProduct = (selectedProductId) => (dispatch, getstate) => {
  const recommendProducts = getstate().setProductsReducer.products;
  const curSelectedProducts = getstate().selectProductReducer.selectedProducts;
  const curSelectedId = getstate().selectProductReducer.selectedProductId;

  // 선택 취소
  if (curSelectedId.includes(selectedProductId)) {
    console.log('already Selected!');
    const afterUnselectId = curSelectedId.filter(
      (id) => id !== selectedProductId,
    );
    dispatch({
      type: ProductActionTypes.UNSELECT_PRODUCT_ID,
      payload: afterUnselectId,
    });
    console.log('curSelectedProducts:', curSelectedProducts);
    Object.entries(curSelectedProducts).map(([category, productList]) => {
      const newProductList = productList.filter(
        (product) => product.id !== Number(selectedProductId),
      );
      curSelectedProducts[category] = newProductList;
    });

    const afterUnselectProducts = { ...curSelectedProducts };
    console.log('afterUnselectProducts:', afterUnselectProducts);
    dispatch({
      type: ProductActionTypes.UNSELECT_PRODUCT,
      payload: afterUnselectProducts,
    });
  } else {
    // 선택
    console.log('curSelectedId:', curSelectedId);
    const newSelectId = [...curSelectedId, selectedProductId];
    console.log(newSelectId);
    dispatch({
      type: ProductActionTypes.SELECT_PRODUCT_ID,
      payload: newSelectId,
    });

    console.log('curSelectedProducts:', curSelectedProducts);

    Object.entries(recommendProducts).map(([category, productList]) => {
      const selectProduct = productList.find(
        (product) => product.id === Number(selectedProductId),
      );
      if (selectProduct) {
        curSelectedProducts[category] = [
          ...curSelectedProducts[category],
          selectProduct,
        ];
      }
    });
    const newSelectedProducts = { ...curSelectedProducts };
    console.log('newSelectedProducts:', newSelectedProducts);

    dispatch({
      type: ProductActionTypes.SELECT_PRODUCT,
      payload: newSelectedProducts,
    });
  }
};

//likes
export const setLikes = () => (dispatch, getstate) => {
  axios
    .get(likesApiUrl, tokenConfig(getstate))
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err.response);
    });

  axios
    .get('https://fakestoreapi.com/products')
    .then((res) => {
      console.log(res.data);

      dispatch({
        type: ProductActionTypes.SET_LIKES,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const deleteLikes = (deleteLikesProductList) => (dispatch, getstate) => {
  const body = JSON.stringify({
    asin: deleteLikesProductList,
  });

  axios
    .delete(cartApiUrl, { data: body }, tokenConfig(getstate))
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err.response);
    });

  const curLikesState = getstate().likesReducer.likesList;
  console.log('curLikesState:', curLikesState);
  const newLikesState = curLikesState.filter(
    (product) => deleteLikesProductList.includes(product.id) === false,
  );
  console.log('newLikesState:', newLikesState);

  dispatch({
    type: ProductActionTypes.DELETE_LIKES,
    payload: newLikesState,
  });
};

export const loadLikes = () => (dispatch, getstate) => {
  axios
    .get(likesApiUrl, tokenConfig(getstate))
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err.response);
    });

  axios
    .get('https://fakestoreapi.com/products')
    .then((res) => {
      console.log(res.data);
      const loadedLikesProduct = res.data;
      const loadedLikes = [];
      loadedLikesProduct.map((product) => {
        loadedLikes.push(product.id);
      });

      // dispatch({
      //   type: ProductActionTypes.LOAD_LIKES,
      //   payload: loadedLikes,
      // });
      dispatch({
        type: ProductActionTypes.LOAD_LIKES,
        payload: [1, 2, 3, 4],
      });
      console.log('loadLikes!!:', getstate().likesReducer.likeProducts);
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const addToLikes = (likeProductList) => (dispatch, getstate) => {
  const curLikesState = getstate().likesReducer.likeProducts;
  console.log('curLikesState:', curLikesState);

  const addToLikesList = likeProductList.filter(
    (product) => curLikesState.includes(Number(product)) === false,
  );

  const body = JSON.stringify({
    asin: addToLikesList,
  });

  axios
    .post(likesApiUrl, body, tokenConfig(getstate))
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err.response);
    });

  const newLikesState = [...curLikesState, ...addToLikesList.map(Number)];
  console.log('newLikesState:', newLikesState);

  dispatch({
    type: ProductActionTypes.ADD_TO_LIKES,
    payload: newLikesState,
  });
};

export const undoLikes = (undoLikesProductList) => (dispatch, getstate) => {
  const body = JSON.stringify({
    asin: undoLikesProductList,
  });

  axios
    .delete(likesApiUrl, { data: body }, tokenConfig(getstate))
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log('undoLikes:', err.response);
    });

  const curLikesState = getstate().likesReducer.likeProducts;
  console.log('curLikesState:', curLikesState);
  const newLikesState = curLikesState.filter(
    (product) => undoLikesProductList.includes(String(product)) === false,
  );
  console.log('newLikesState:', newLikesState);

  dispatch({
    type: ProductActionTypes.UNDO_LIKES,
    payload: newLikesState,
  });
};

// cart
export const setCart = () => (dispatch, getstate) => {
  axios
    .get(cartApiUrl, tokenConfig(getstate))
    .then((res) => {
      console.log('setCart Success!!', res.data);
    })
    .catch((err) => {
      console.log('setCart Fail!!', err.response);
    });

  axios
    .get('https://fakestoreapi.com/products')
    .then((res) => {
      console.log(res.data);

      dispatch({
        type: ProductActionTypes.SET_CART,
        payload: res.data,
      });
      console.log(getstate());
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const deleteCart = (deleteCartProductList) => (dispatch, getstate) => {
  const body = JSON.stringify({
    asin: deleteCartProductList,
  });

  axios
    .delete(cartApiUrl, { data: body }, tokenConfig(getstate))
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err.response);
    });

  const curCartState = getstate().cartReducer.cartList;
  console.log('curCartState:', curCartState);
  const newCartState = curCartState.filter(
    (product) => deleteCartProductList.includes(product.id) === false,
  );
  console.log('newCartState:', newCartState);

  dispatch({
    type: ProductActionTypes.DELETE_CART,
    payload: newCartState,
  });
};

export const loadCart = () => (dispatch, getstate) => {
  axios
    .get(cartApiUrl, tokenConfig(getstate))
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log('loadCart:', err.response);
    });

  axios
    .get('https://fakestoreapi.com/products')
    .then((res) => {
      console.log(res.data);
      const loadedCartProduct = res.data;
      const loadedcart = [];
      loadedCartProduct.map((product) => {
        loadedcart.push(product.id);
      });

      // dispatch({
      //   type: ProductActionTypes.LOAD_CART,
      //   payload: loadedLikes,
      // });

      dispatch({
        type: ProductActionTypes.LOAD_CART,
        payload: [5, 6, 7, 8],
      });
      console.log('loadCart!!:', getstate().cartReducer.cartProducts);
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const addToCart = (cartProductList) => (dispatch, getstate) => {
  const curCartState = getstate().cartReducer.cartProducts;
  console.log('curCartState:', curCartState);

  const addToCartList = cartProductList.filter(
    (product) => curCartState.includes(Number(product)) === false,
  );

  console.log('addToCartList:', addToCartList);
  const body = JSON.stringify({
    asin: cartProductList,
  });

  axios
    .post(cartApiUrl, body, tokenConfig(getstate))
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err.response);
    });

  const newCartState = [...curCartState, ...addToCartList.map(Number)];
  console.log('newCartState:', newCartState);

  dispatch({
    type: ProductActionTypes.ADD_TO_CART,
    payload: newCartState,
  });
};

export const undoCart = (removeCartProductList) => (dispatch, getstate) => {
  const body = JSON.stringify({
    asin: removeCartProductList,
  });

  axios
    .delete(cartApiUrl, { data: body }, tokenConfig(getstate))
    .then((res) => {
      console.log('undoCart:', res.data);
    })
    .catch((err) => {
      console.log('undoCart:', err.response);
    });

  const curCartState = getstate().cartReducer.cartProducts;
  console.log('curCartState:', curCartState);
  const newCartState = curCartState.filter(
    (product) => removeCartProductList.includes(String(product)) === false,
  );
  console.log('newCartState:', newCartState);

  dispatch({
    type: ProductActionTypes.UNDO_CART,
    payload: newCartState,
  });
};

export const orderRequest =
  (orderRequestProductList) => (dispatch, getstate) => {
    dispatch({
      type: ProductActionTypes.ORDER_REQUEST,
      payload: orderRequestProductList,
    });
  };

export const showModal = (productId) => (dispatch, getstate) => {
  if (productId === 0) {
    const resetModalState = {
      key: '',
      data: {},
    };
    dispatch({
      type: ProductActionTypes.RESET_MODAL,
      payload: resetModalState,
    });
  } else {
    axios
      .get(`https://fakestoreapi.com/products/${productId}`)
      .then((res) => {
        console.log(res.data);
        const newModalState = {
          key: productId,
          data: res.data,
        };
        dispatch({
          type: ProductActionTypes.SHOW_MODAL,
          payload: newModalState,
        });
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
};

//orderhistory
export const setOrderDetails = (orderId) => (dispatch, getstate) => {
  axios
    .get(`${orderApiUrl}${Number(orderId)}/`, tokenConfig(getstate))
    .then((res) => {
      console.log('setOrderDetails Success', res.data);
    })
    .catch((err) => {
      console.log('setOrderDetails Fail', err.response);
    });

  // fake api
  axios
    .get('https://fakestoreapi.com/products')
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: ProductActionTypes.SET_ORDER_DETAILS,
        payload: res.data,
      });
      console.log(getstate());
    })
    .catch((err) => {
      console.log(err.response);
    });
};
