import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Products.css";
import ProductCard from "./ProductCard";
import { getProducts } from "../services/productService";

function Products() {
    const [searchParams, setSearchParams] =
        useSearchParams();

    // =========================
    // URL PARAMETERS
    // =========================

    const categoryId =
        searchParams.get("categoryId");

    const keyword =
        searchParams.get("keyword");

    const currentPage = Number(
        searchParams.get("page") || 0
    );

    // =========================
    // STATE
    // =========================

    const [products, setProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [totalPages, setTotalPages] =
        useState(0);

    const [totalElements, setTotalElements] =
        useState(0);

    const [minPrice, setMinPrice] =
        useState(
            searchParams.get("minPrice") || ""
        );

    const [maxPrice, setMaxPrice] =
        useState(
            searchParams.get("maxPrice") || ""
        );

    const [inStock, setInStock] =
        useState(
            searchParams.get("inStock") || ""
        );

    const [sortBy, setSortBy] =
        useState(
            searchParams.get("sortBy") || "name"
        );

    const [direction, setDirection] =
        useState(
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

                const data =
                    await getProducts({
                        categoryId: categoryId
                            ? Number(categoryId)
                            : undefined,

                        keyword:
                            keyword || undefined,

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

                setProducts(
                    data.content || []
                );

                setTotalPages(
                    data.totalPages || 0
                );

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
        const params =
            new URLSearchParams(
                searchParams
            );

        params.set(
            "page",
            page
        );

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

    const headingText = keyword
        ? `Search results for "${keyword}"`
        : categoryId
            ? "Drinks in this category"
            : "All Drinks";

    const headingLabel = keyword
        ? "SEARCH"
        : "DRINKS";

    return (
        <main className="products-page">

            {/* =================================
                HEADER
            ================================= */}

            <section className="products-header">

                <div>

                    <p className="products-label">
                        {headingLabel}
                    </p>

                    <h1>
                        {headingText}
                    </h1>

                    {!loading &&
                        !error && (
                            <p className="products-subtitle">
                                {totalElements}{" "}
                                {totalElements === 1
                                    ? "drink"
                                    : "drinks"}{" "}
                                available
                            </p>
                        )}

                </div>

            </section>

            {/* =================================
                FILTER CARD
            ================================= */}

            <section className="products-filter-card">

                <div className="products-filter-grid">

                    {/* MIN PRICE */}

                    <div className="product-filter-field">

                        <label htmlFor="filter-min-price">
                            Min Price
                        </label>

                        <div className="price-input">

                            <span>₹</span>

                            <input
                                id="filter-min-price"
                                type="number"
                                min="0"
                                placeholder="Minimum"
                                value={minPrice}
                                onChange={(e) =>
                                    setMinPrice(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                    {/* MAX PRICE */}

                    <div className="product-filter-field">

                        <label htmlFor="filter-max-price">
                            Max Price
                        </label>

                        <div className="price-input">

                            <span>₹</span>

                            <input
                                id="filter-max-price"
                                type="number"
                                min="0"
                                placeholder="Maximum"
                                value={maxPrice}
                                onChange={(e) =>
                                    setMaxPrice(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                    {/* AVAILABILITY */}

                    <div className="product-filter-field">

                        <label htmlFor="filter-in-stock">
                            Availability
                        </label>

                        <select
                            id="filter-in-stock"
                            value={inStock}
                            onChange={(e) =>
                                setInStock(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                All Products
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

                    <div className="product-filter-field">

                        <label htmlFor="filter-sort-by">
                            Sort By
                        </label>

                        <select
                            id="filter-sort-by"
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

                    {/* ORDER */}

                    <div className="product-filter-field">

                        <label htmlFor="filter-direction">
                            Order
                        </label>

                        <select
                            id="filter-direction"
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

                </div>

                {/* BUTTONS */}

                <div className="products-filter-actions">

                    <button
                        type="button"
                        className="products-apply-btn"
                        onClick={
                            applyFilters
                        }
                    >
                        Apply Filters
                    </button>

                    <button
                        type="button"
                        className="products-reset-btn"
                        onClick={
                            resetFilters
                        }
                    >
                        Reset
                    </button>

                </div>

            </section>

            {/* =================================
                RESULTS
            ================================= */}

            {!loading &&
                !error &&
                totalElements > 0 && (

                    <div className="products-results-row">

                        <p>
                            <strong>
                                {totalElements}
                            </strong>{" "}
                            drinks found
                        </p>

                    </div>
                )}

            {/* =================================
                LOADING
            ================================= */}

            {loading && (

                <div className="products-loading">

                    <div className="products-spinner" />

                    <p>
                        Loading drinks...
                    </p>

                </div>
            )}

            {/* =================================
                ERROR
            ================================= */}

            {!loading &&
                error && (

                    <div className="products-error">

                        <h3>
                            Something went wrong
                        </h3>

                        <p>
                            {error}
                        </p>

                    </div>
                )}

            {/* =================================
                PRODUCT GRID
            ================================= */}

            {!loading &&
                !error &&
                products.length > 0 && (

                    <div className="products-grid">

                        {products.map(
                            (product) => (

                                <ProductCard
                                    key={
                                        product.id
                                    }
                                    product={
                                        product
                                    }
                                />

                            )
                        )}

                    </div>
                )}

            {/* =================================
                EMPTY
            ================================= */}

            {!loading &&
                !error &&
                products.length === 0 && (

                    <div className="products-empty">

                        <div className="products-empty-icon">
                            🥤
                        </div>

                        <h3>
                            No drinks found
                        </h3>

                        <p>
                            {keyword
                                ? `No drinks found for "${keyword}".`
                                : "Try changing your filters."}
                        </p>

                        <button
                            type="button"
                            onClick={
                                resetFilters
                            }
                        >
                            Clear Filters
                        </button>

                    </div>
                )}

            {/* =================================
                PAGINATION
            ================================= */}

            {!loading &&
                !error &&
                totalPages > 1 && (

                    <div className="products-pagination">

                        <button
                            type="button"
                            disabled={
                                currentPage ===
                                0
                            }
                            onClick={() =>
                                changePage(
                                    currentPage -
                                        1
                                )
                            }
                        >
                            ← Previous
                        </button>

                        {pageNumbers.map(
                            (page) => (

                                <button
                                    type="button"
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
                            type="button"
                            disabled={
                                currentPage >=
                                totalPages -
                                    1
                            }
                            onClick={() =>
                                changePage(
                                    currentPage +
                                        1
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