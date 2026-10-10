// src/pages/Products.jsx

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import products from "../data/Product";
import ProductCard from "../components/product/ProductCard";

// Available departments and product categories for filtering.
const departments = ["All", "Men", "Women", "Unisex"];

const categories = [
    "All Categories",
    "T-Shirts",
    "Jeans",
    "Hoodies",
    "Jackets",
    "Dresses",
    "Sneakers",
    "Accessories",
];

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("featured");

    // Read the initial filters from the URL.
    const selectedDepartment = departments.includes(
        searchParams.get("department")
    )
        ? searchParams.get("department")
        : "All";

    const selectedCategory = categories.includes(
        searchParams.get("category")
    )
        ? searchParams.get("category")
        : "All Categories";

    // Update the URL while preserving the other active filter.
    const updateFilter = (key, value) => {
        const nextParams = new URLSearchParams(searchParams);

        if (
            value === "All" ||
            value === "All Categories" ||
            !value
        ) {
            nextParams.delete(key);
        } else {
            nextParams.set(key, value);
        }

        setSearchParams(nextParams);
    };

    // Filter products by department, category, and search text.
    const filteredProducts = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        const result = products.filter((product) => {
            const matchesDepartment =
                selectedDepartment === "All" ||
                product.department === selectedDepartment;

            const matchesCategory =
                selectedCategory === "All Categories" ||
                product.category === selectedCategory;

            const matchesSearch =
                !normalizedSearch ||
                product.title.toLowerCase().includes(normalizedSearch) ||
                product.brand.toLowerCase().includes(normalizedSearch) ||
                product.category.toLowerCase().includes(normalizedSearch);

            return (
                matchesDepartment &&
                matchesCategory &&
                matchesSearch
            );
        });

        // Sort a copy of the filtered products without mutating the source data.
        switch (sortBy) {
            case "price-low":
                return [...result].sort((a, b) => a.price - b.price);

            case "price-high":
                return [...result].sort((a, b) => b.price - a.price);

            case "rating":
                return [...result].sort((a, b) => b.rating - a.rating);

            case "discount":
                return [...result].sort((a, b) => b.discount - a.discount);

            default:
                return result;
        }
    }, [
        searchTerm,
        selectedDepartment,
        selectedCategory,
        sortBy,
    ]);

    // Reset all filters and restore the default product listing.
    const clearFilters = () => {
        setSearchTerm("");
        setSortBy("featured");
        setSearchParams({});
    };

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Page heading */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
                        Find your style
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        All Products
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Discover something you'll love.
                    </p>
                </div>

                <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">
                        {filteredProducts.length}
                    </span>{" "}
                    products found
                </p>
            </div>

            {/* Search and sorting */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="product-search"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Search products
                    </label>

                    <input
                        id="product-search"
                        type="search"
                        placeholder="Search by name, brand, or category..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label
                        htmlFor="product-sort"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Sort products
                    </label>

                    <select
                        id="product-sort"
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="discount">Biggest Discount</option>
                    </select>
                </div>
            </div>

            {/* Department filters */}
            <div className="mb-6">
                <h2 className="mb-3 text-sm font-semibold text-gray-900">
                    Shop by department
                </h2>

                <div className="flex flex-wrap gap-2">
                    {departments.map((department) => (
                        <button
                            key={department}
                            type="button"
                            onClick={() =>
                                updateFilter("department", department)
                            }
                            aria-pressed={
                                selectedDepartment === department
                            }
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                selectedDepartment === department
                                    ? "border-gray-900 bg-gray-900 text-white"
                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
                            }`}
                        >
                            {department}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product category filters */}
            <div className="mb-8">
                <h2 className="mb-3 text-sm font-semibold text-gray-900">
                    Shop by category
                </h2>

                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() =>
                                updateFilter("category", category)
                            }
                            aria-pressed={selectedCategory === category}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                selectedCategory === category
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Active filters and reset action */}
            {(selectedDepartment !== "All" ||
                selectedCategory !== "All Categories" ||
                searchTerm.trim() !== "") && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-gray-500">
                        Showing filtered results
                    </p>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* Product grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-20 text-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        No products found
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Try changing your search or selecting different filters.
                    </p>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </section>
    );
};

export default Products;
