const CART_KEY = "drinkit_cart";

export const getCart = () => {
  const cart = localStorage.getItem(CART_KEY);

  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );
};

export const getCartCount = () => {
  return getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );
};