import { useCart } from "../context/CartContext";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import products from "../data/Product";

const ProductDetails = () => {
    const { id } = useParams();

    const product = products.find(
        (item) => item.id === Number(id)
    );
    const { addToCart } = useCart();

    const [cartMessage, setCartMessage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    // Tracks whether the latest cart operation succeeded.
    const [cartMessageType, setCartMessageType] = useState("");

    if (!product) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-24 text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    Product Not Found
                </h1>
                <p className="mt-3 text-gray-500">
                    Sorry, this product doesn't exist.
                </p>
                <Link
                    to="/products"
                    className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 text-white hover:bg-gray-700"
                >
                    Back to Products
                </Link>
            </div>
        );
    }

    const discountedPrice = Math.round(
        product.price * (1 - product.discount / 100)
    );

    const isOutOfStock = product.stock <= 0;


    // Adds the selected product variant and displays the operation result.
    const handleAddToCart = () => {
        const result = addToCart(
            product.id,
            Number(quantity),
            selectedSize,
            selectedColor
        );

        setCartMessage(result.message);
        setCartMessageType(result.success ? "success" : "error");
    };


    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
                to="/products"
                className="mb-8 flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
                <i class="ri-arrow-left-long-line"></i>
                Back to Products
            </Link>

            <div className="grid grid-cols-1 gap-10 place-items-center md:grid-cols-2 md:gap-5">
                <div className="overflow-hidden rounded-2xl bg-gray-100">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="h-full min-h-[400px] max-h-[650px] w-full object-cover"
                    />
                </div>

                <div className="flex flex-col">
                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                        {product.brand}
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {product.title}
                    </h1>

                    <p className="mt-3 text-sm text-gray-500">
                        {product.category} · ⭐ {product.rating} / 5
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <span className="text-3xl font-bold text-gray-900">
                            ₹{discountedPrice}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                            ₹{product.price}
                        </span>
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                            {product.discount}% OFF
                        </span>
                    </div>

                    <p className="mt-6 leading-7 text-gray-600">
                        {product.description}
                    </p>

                    {product.sizes.length > 0 && (
                        <div className="mt-8">
                            <h2 className="mb-3 font-semibold text-gray-900">
                                Select Size
                            </h2>

                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => setSelectedSize(size)}
                                        aria-pressed={selectedSize === size}
                                        className={`min-w-12 rounded-lg border px-4 py-2 text-sm font-medium transition ${selectedSize === size
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : "border-gray-200 hover:border-gray-900"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.colors.length > 0 && (
                        <div className="mt-6">
                            <h2 className="mb-3 font-semibold text-gray-900">
                                Select Color
                            </h2>

                            <div className="flex flex-wrap gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setSelectedColor(color)}
                                        aria-pressed={selectedColor === color}
                                        className={`rounded-lg border px-4 py-2 text-sm transition ${selectedColor === color
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : "border-gray-200 hover:border-gray-900"
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8">
                        <h2 className="mb-3 font-semibold text-gray-900">
                            Quantity
                        </h2>

                        <div className="inline-flex items-center rounded-lg border border-gray-200">
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((current) => Math.max(1, current - 1))
                                }
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                                className="px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                −
                            </button>

                            <span className="min-w-10 text-center">{quantity}</span>

                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((current) =>
                                        Math.min(product.stock, current + 1)
                                    )
                                }
                                disabled={quantity >= product.stock}
                                aria-label="Increase quantity"
                                className="px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                +
                            </button>
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                            {isOutOfStock
                                ? "Out of stock"
                                : `${product.stock} items available`}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className="mt-8 w-full rounded-xl bg-gray-900 px-6 py-4 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                    </button>


                    {cartMessage && (
                        <p
                            role="status"
                            className={`mt-3 text-sm font-medium ${cartMessageType === "success"
                                    ? "text-green-600"
                                    : "text-red-500"
                                }`}
                        >
                            {cartMessage}
                        </p>
                    )}

                </div>
            </div>
        </section>
    );
};

export default ProductDetails;