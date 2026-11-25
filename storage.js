import {
  createSampleMembers,
  initialClasses,
  products as defaultProducts,
} from "./data.js";

export const KEYS = {
  members: "fitness-members",
  bookings: "fitness-bookings",
  shop: "fitness-shop-v1",
  adminCatalog: "fitness-admin-catalog-v1",
};

const validId = (id) => typeof id === "string" || typeof id === "number";

const isMember = (m) =>
  m &&
  validId(m.id) &&
  typeof m.name === "string" &&
  ["Basic", "Plus", "Pro"].includes(m.packageName);

const isBooking = (b) =>
  b &&
  typeof b.id === "string" &&
  validId(b.memberId) &&
  validId(b.classId);

const isProduct = (p) =>
  p &&
  typeof p.id === "string" &&
  typeof p.name === "string" &&
  typeof p.category === "string" &&
  Number.isFinite(p.price) &&
  p.price >= 0;

const isGymClass = (c) =>
  c &&
  validId(c.id) &&
  typeof c.name === "string" &&
  typeof c.coach === "string" &&
  typeof c.day === "string" &&
  typeof c.time === "string" &&
  Number.isInteger(c.capacity) &&
  c.capacity > 0;

const isConsultation = (item) =>
  item &&
  typeof item.id === "string" &&
  typeof item.firstName === "string" &&
  typeof item.lastName === "string" &&
  typeof item.phone === "string";

const VALID_ORDER_STATUSES = [
  "awaiting_transfer",
  "customer_reported",
  "confirmed",
  "completed",
  "cancelled",
];

const isOrder = (o) =>
  o &&
  typeof o.id === "string" &&
  typeof o.createdAt === "string" &&
  ["products", "package"].includes(o.kind) &&
  VALID_ORDER_STATUSES.includes(o.status) &&
  o.customer &&
  typeof o.customer.name === "string" &&
  typeof o.customer.phone === "string" &&
  Array.isArray(o.items) &&
  o.items.length > 0 &&
  o.items.every(
    (i) =>
      i &&
      typeof i.name === "string" &&
      Number.isFinite(i.price) &&
      i.price >= 0 &&
      Number.isInteger(i.quantity) &&
      i.quantity > 0,
  ) &&
  Number.isFinite(o.total) &&
  o.total === o.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

function upgradeLegacyProducts(storedProducts) {
  const defaultMap = new Map(defaultProducts.map((p) => [p.id, p]));
  const enriched = storedProducts.map((item) => {
    const def = defaultMap.get(item.id);
    if (!def) return item;
    return {
      ...def,
      ...item,
      image: item.image || def.image,
      rating: item.rating ?? def.rating,
      sold: item.sold ?? def.sold,
      originalPrice: item.originalPrice ?? def.originalPrice,
    };
  });

  // Nếu dữ liệu cũ chỉ có <= 6 sản phẩm mặc định chưa có ảnh, tự động nạp đủ 20 sản phẩm mới
  const hasAnyLegacyWithoutImage = storedProducts.some(
    (item) => defaultMap.has(item.id) && !item.image,
  );
  if (hasAnyLegacyWithoutImage && storedProducts.length <= 6) {
    const existingIds = new Set(enriched.map((p) => p.id));
    const additions = defaultProducts.filter((p) => !existingIds.has(p.id));
    return [...enriched, ...additions];
  }
  return enriched;
}

export function createSampleData() {
  return {
    members: createSampleMembers(),
    bookings: [],
    cart: [],
    orders: [],
    products: structuredClone(defaultProducts),
    classes: structuredClone(initialClasses),
    consultations: [],
  };
}

export function readLocalData() {
  const errors = [];
  function read(key, fallback, validate) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      const value = JSON.parse(raw);
      if (!validate(value)) throw new Error("Sai cấu trúc dữ liệu");
      return value;
    } catch {
      errors.push(key);
      return fallback;
    }
  }

  const rawCatalog = read(
    KEYS.adminCatalog,
    {
      products: structuredClone(defaultProducts),
      classes: structuredClone(initialClasses),
      consultations: [],
    },
    (v) =>
      v &&
      Array.isArray(v.products) &&
      v.products.every(isProduct) &&
      Array.isArray(v.classes) &&
      v.classes.every(isGymClass) &&
      Array.isArray(v.consultations) &&
      v.consultations.every(isConsultation),
  );

  const catalog = {
    ...rawCatalog,
    products: upgradeLegacyProducts(rawCatalog.products),
  };

  const members = read(
    KEYS.members,
    createSampleMembers(),
    (v) => Array.isArray(v) && v.every(isMember),
  );

  const bookings = read(
    KEYS.bookings,
    [],
    (v) => Array.isArray(v) && v.every(isBooking),
  );

  const isCartItem = (item) => {
    const p = item && catalog.products.find((prod) => prod.id === item.productId);
    return (
      p &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= (p.maxQuantity || 10)
    );
  };

  const shop = read(
    KEYS.shop,
    { cart: [], orders: [] },
    (v) =>
      v &&
      Array.isArray(v.cart) &&
      v.cart.every(isCartItem) &&
      new Set(v.cart.map((i) => i.productId)).size === v.cart.length &&
      Array.isArray(v.orders) &&
      v.orders.every(isOrder),
  );

  return {
    data: {
      members,
      bookings: bookings.filter(
        (b) =>
          members.some((m) => m.id === b.memberId) &&
          catalog.classes.some((c) => c.id === b.classId),
      ),
      cart: shop.cart,
      orders: shop.orders,
      products: catalog.products,
      classes: catalog.classes,
      consultations: catalog.consultations,
    },
    error: errors.length
      ? "Không đọc được dữ liệu: " +
        errors.join(", ") +
        ". Tạm dừng ghi để giữ bản cũ."
      : "",
  };
}

export function writeLocalData(data) {
  localStorage.setItem(KEYS.members, JSON.stringify(data.members));
  localStorage.setItem(KEYS.bookings, JSON.stringify(data.bookings));
  localStorage.setItem(
    KEYS.shop,
    JSON.stringify({ cart: data.cart, orders: data.orders }),
  );
  localStorage.setItem(
    KEYS.adminCatalog,
    JSON.stringify({
      products: data.products,
      classes: data.classes,
      consultations: data.consultations,
    }),
  );
}

export function writeShopData(cart, orders) {
  localStorage.setItem(KEYS.shop, JSON.stringify({ cart, orders }));
}
