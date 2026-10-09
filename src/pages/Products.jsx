import { useState } from "react";
import products from "../data/Product";
import ProductCard from "../components/product/ProductCard";

const Products = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
                        Find your style
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        All Products
                    </h1>

                    <p className="mt-2 text-gray-500 text-[14px]">
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

            <div className="mb-8">
                <label htmlFor="product-search" className="sr-only">
                    Search products
                </label>

                <input
                    id="product-search"
                    type="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:max-w-md"
                />
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-20 text-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        No products found
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Try another search term.
                    </p>

                    <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
                    >
                        Clear search
                    </button>
                </div>
            )}
        </section>
    );
};

export default Products;