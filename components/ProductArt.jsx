import { useEffect, useState } from "react";

const FALLBACK_PRODUCT_PHOTO =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80";

export default function ProductArt({ product, className = "" }) {
  const primarySrc = product?.image || FALLBACK_PRODUCT_PHOTO;
  const [imgSrc, setImgSrc] = useState(primarySrc);

  useEffect(() => {
    setImgSrc(product?.image || FALLBACK_PRODUCT_PHOTO);
  }, [product?.image]);

  return (
    <div
      className={"product-photo-wrap " + className}
      style={{ background: product?.color || "#eef2e6" }}
    >
      <img
        className="product-photo"
        src={imgSrc}
        alt={product?.name || "Sản phẩm FITNESS"}
        loading="lazy"
        onError={() => {
          if (imgSrc !== FALLBACK_PRODUCT_PHOTO) {
            setImgSrc(FALLBACK_PRODUCT_PHOTO);
          }
        }}
      />
    </div>
  );
}
