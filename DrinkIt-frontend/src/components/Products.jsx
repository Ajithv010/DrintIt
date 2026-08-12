import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "./ProductCard";
import { getProducts } from "../services/productService";

function Products() {
  const [searchParams] = useSearchParams();

  const categoryId = searchParams.get("categoryId");
  const keyword = searchParams.get("keyword");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts({
          categoryId: categoryId
            ? Number(categoryId)
            : undefined,

          keyword: keyword || undefined,
        });

        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId, keyword]);

  return (
    <main className="section">

      {/* HEADER */}

      <div className="section-header">
        <div>

          <p className="section-label">
            {keyword ? "SEARCH" : "DRINKS"}
          </p>

          <h2>
            {keyword
              ? `Search results for "${keyword}"`
              : categoryId
                ? "Drinks in this category"
                : "All Drinks"}
          </h2>

        </div>
      </div>

      {/* LOADING */}

      {loading && (
        <p>Loading products...</p>
      )}

      {/* ERROR */}

      {!loading && error && (
        <p>{error}</p>
      )}

      {/* PRODUCTS */}

      {!loading &&
        !error &&
        products.length > 0 && (
          <div className="products">

            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>
        )}

      {/* NO PRODUCTS */}

      {!loading &&
        !error &&
        products.length === 0 && (
          <p>
            {keyword
              ? `No drinks found for "${keyword}".`
              : "No drinks available in this category."}
          </p>
        )}

    </main>
  );
}

export default Products;