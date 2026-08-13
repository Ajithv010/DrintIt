import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "./ProductCard";
import { getProducts } from "../services/productService";

function Products() {
    const [searchParams, setSearchParams] = useSearchParams();

    // =========================
    // URL PARAMETERS
    // =========================

    const categoryId = searchParams.get("categoryId");
    const keyword = searchParams.get("keyword");

    const currentPage = Number(
        searchParams.get("page") || 0
    );

    // =========================
    // STATE
    // =========================

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [totalPages, setTotalPages] = useState(0);

    const [totalElements, setTotalElements] = useState(0);

    const [minPrice, setMinPrice] = useState(
        searchParams.get("minPrice") || ""
    );

    const [maxPrice, setMaxPrice] = useState(
        searchParams.get("maxPrice") || ""
    );

    const [inStock, setInStock] = useState(
        searchParams.get("inStock") || ""
    );

    const [sortBy, setSortBy] = useState(
        searchParams.get("sortBy") || "name"
    );

    const [direction, setDirection] = useState(
        searchParams.get("direction") || "asc"
    );

    // =========================
    // LOAD PRODUCTS
    // =========================

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

                    minPrice: minPrice
                        ? Number(minPrice)
                        : undefined,

                    maxPrice: maxPrice
                        ? Number(maxPrice)
                        : undefined,

                    inStock:
                        inStock === ""
                            ? undefined
                            : inStock === "true",

                    page: currentPage,

                    size: 10,

                    sortBy,

                    direction,
                });

                setProducts(data.content || []);

                setTotalPages(data.totalPages || 0);

                setTotalElements(
                    data.totalElements || 0
                );
            } catch (err) {
                console.error(
                    "Error loading products:",
                    err
                );

                setError(
                    "Unable to load products."
                );

                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [
        categoryId,
        keyword,
        currentPage,
        minPrice,
        maxPrice,
        inStock,
        sortBy,
        direction,
    ]);

    // =========================
    // APPLY FILTERS
    // =========================

    const applyFilters = () => {
        const params = {};

        if (keyword) {
            params.keyword = keyword;
        }

        if (categoryId) {
            params.categoryId = categoryId;
        }

        if (minPrice) {
            params.minPrice = minPrice;
        }

        if (maxPrice) {
            params.maxPrice = maxPrice;
        }

        if (inStock) {
            params.inStock = inStock;
        }

        if (sortBy) {
            params.sortBy = sortBy;
        }

        if (direction) {
            params.direction = direction;
        }

        params.page = "0";

        setSearchParams(params);
    };

    // =========================
    // PAGE CHANGE
    // =========================

    const changePage = (page) => {
        const params = new URLSearchParams(
            searchParams
        );

        params.set("page", page);

        setSearchParams(params);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================
    // RESET FILTERS
    // =========================

    const resetFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        setInStock("");
        setSortBy("name");
        setDirection("asc");

        const params = {};

        if (keyword) {
            params.keyword = keyword;
        }

        if (categoryId) {
            params.categoryId = categoryId;
        }

        params.page = "0";

        setSearchParams(params);
    };

    // =========================
    // PAGE NUMBERS
    // =========================

    const pageNumbers = [];

    for (
        let i = 0;
        i < totalPages;
        i++
    ) {
        pageNumbers.push(i);
    }

    // =========================
    // UI
    // =========================

    return (
        <main className="section">

            {/* =========================
                HEADER
            ========================= */}

            <div className="section-header">

                <div>

                    <p className="section-label">
                        {keyword
                            ? "SEARCH"
                            : "DRINKS"}
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

            {/* =========================
                FILTERS
            ========================= */}

            <div className="product-filters">

                {/* MIN PRICE */}

                <div>
                    <label>
                        Min Price
                    </label>

                    <input
                        type="number"
                        min="0"
                        placeholder="₹ Min"
                        value={minPrice}
                        onChange={(e) =>
                            setMinPrice(
                                e.target.value
                            )
                        }
                    />
                </div>

                {/* MAX PRICE */}

                <div>
                    <label>
                        Max Price
                    </label>

                    <input
                        type="number"
                        min="0"
                        placeholder="₹ Max"
                        value={maxPrice}
                        onChange={(e) =>
                            setMaxPrice(
                                e.target.value
                            )
                        }
                    />
                </div>

                {/* STOCK */}

                <div>
                    <label>
                        Availability
                    </label>

                    <select
                        value={inStock}
                        onChange={(e) =>
                            setInStock(
                                e.target.value
                            )
                        }
                    >
                        <option value="">
                            All
                        </option>

                        <option value="true">
                            In Stock
                        </option>

                        <option value="false">
                            Out of Stock
                        </option>
                    </select>
                </div>

                {/* SORT */}

                <div>
                    <label>
                        Sort By
                    </label>

                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(
                                e.target.value
                            )
                        }
                    >
                        <option value="name">
                            Name
                        </option>

                        <option value="price">
                            Price
                        </option>

                        <option value="stock">
                            Stock
                        </option>
                    </select>
                </div>

                {/* DIRECTION */}

                <div>
                    <label>
                        Order
                    </label>

                    <select
                        value={direction}
                        onChange={(e) =>
                            setDirection(
                                e.target.value
                            )
                        }
                    >
                        <option value="asc">
                            Low → High
                        </option>

                        <option value="desc">
                            High → Low
                        </option>
                    </select>
                </div>

                {/* APPLY */}

                <button
                    onClick={applyFilters}
                >
                    Apply Filters
                </button>

                {/* RESET */}

                <button
                    onClick={resetFilters}
                >
                    Reset
                </button>

            </div>

            {/* =========================
                RESULT COUNT
            ========================= */}

            {!loading &&
                !error &&
                totalElements > 0 && (

                    <p>
                        {totalElements} drinks found
                    </p>

                )}

            {/* =========================
                LOADING
            ========================= */}

            {loading && (
                <p>
                    Loading products...
                </p>
            )}

            {/* =========================
                ERROR
            ========================= */}

            {!loading && error && (
                <p>
                    {error}
                </p>
            )}

            {/* =========================
                PRODUCTS
            ========================= */}

            {!loading &&
                !error &&
                products.length > 0 && (

                    <div className="products">

                        {products.map(
                            (product) => (

                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />

                            )
                        )}

                    </div>

                )}

            {/* =========================
                EMPTY
            ========================= */}

            {!loading &&
                !error &&
                products.length === 0 && (

                    <p>
                        {keyword
                            ? `No drinks found for "${keyword}".`
                            : "No drinks available."}
                    </p>

                )}

            {/* =========================
                PAGINATION
            ========================= */}

            {!loading &&
                !error &&
                totalPages > 1 && (

                    <div className="pagination">

                        <button
                            disabled={
                                currentPage === 0
                            }
                            onClick={() =>
                                changePage(
                                    currentPage - 1
                                )
                            }
                        >
                            ← Previous
                        </button>

                        {pageNumbers.map(
                            (page) => (

                                <button
                                    key={page}
                                    className={
                                        page ===
                                        currentPage
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        changePage(
                                            page
                                        )
                                    }
                                >
                                    {page + 1}
                                </button>

                            )
                        )}

                        <button
                            disabled={
                                currentPage >=
                                totalPages - 1
                            }
                            onClick={() =>
                                changePage(
                                    currentPage + 1
                                )
                            }
                        >
                            Next →
                        </button>

                    </div>

                )}

        </main>
    );
}

export default Products;