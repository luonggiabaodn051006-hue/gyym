import { products as defaultProducts, packages } from "./data.js";

export function getCartLines(cart, productList = defaultProducts) {
  return cart
    .map((item) => {
      const product = productList.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        ...product,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      };
    })
    .filter(Boolean);
}

export function changeQuantity(
  cart,
  productId,
  quantity,
  productList = defaultProducts,
) {
  const product = productList.find((p) => p.id === productId);
  if (!product || !Number.isInteger(quantity)) return cart;
  if (quantity <= 0) return cart.filter((item) => item.productId !== productId);
  const safeQuantity = Math.min(quantity, product.maxQuantity || 10);
  if (cart.some((item) => item.productId === productId)) {
    return cart.map((item) =>
      item.productId === productId ? { ...item, quantity: safeQuantity } : item,
    );
  }
  return [...cart, { productId, quantity: safeQuantity }];
}

export function getCheckoutLines(
  cart,
  packageId,
  productList = defaultProducts,
) {
  if (packageId) {
    const plan = packages.find((p) => p.id === packageId);
    return plan
      ? [
          {
            id: plan.id,
            name: "Gói " + plan.name + " · " + plan.months + " tháng",
            price: plan.price,
            quantity: 1,
          },
        ]
      : [];
  }
  return getCartLines(cart, productList).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    quantity: p.quantity,
  }));
}

export function orderTotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function validateCustomer(customer) {
  if (customer.name.trim().length < 2) return "Họ tên cần ít nhất 2 ký tự.";
  if (!/^0\d{9}$/.test(customer.phone.trim()))
    return "Số điện thoại cần 10 chữ số, bắt đầu bằng 0.";
  return "";
}
