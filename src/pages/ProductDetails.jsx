import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import products from "../data/Product";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

// Displays product details, an image gallery, and shopping controls.
const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const product = products.find((item) => item.id === Number(id));

    const { addToCart } = useCart();
    const { toggleWishlist, isWishlisted } = useWishlist();
    const { isAuthenticated } = useAuth();

    const [currentImage, setCurrentImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [cartMessage, setCartMessage] = useState("");
    const [cartMessageType, setCartMessageType] = useState("");
    const [touchStart, setTouchStart] = useState(null);

    if (!product) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-24 text-center">
                <i className="ri-shopping-bag-3-line text-5xl text-gray-300" aria-hidden="true" />

                <h1 className="mt-4 text-3xl font-semibold text-gray-900">
                    Product Not Found
                </h1>

                <p className="mt-3 text-gray-500">
                    Sorry, this product doesn't exist or may have been removed.
                </p>

                <Link
                    to="/products"
                    className="mt-6 inline-flex rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
                >
                    Back to Products
                </Link>
            </div>
        );
    }

    const images =
        product.images?.length > 0
            ? product.images
            : product.image
                ? [product.image]
                : [];

    const discountedPrice = Math.round(
        product.price * (1 - product.discount / 100)
    );

    const isOutOfStock = product.stock <= 0;
    const isProductWishlisted = isWishlisted(product.id);

    // Selects a gallery image by its index.
    const selectImage = (index) => {
        setCurrentImage(index);
    };

    // Navigates between gallery images and wraps around at either end.
    const changeImage = (direction) => {
        if (images.length < 2) return;

        setCurrentImage(
            (current) => (current + direction + images.length) % images.length
        );
    };

    // Records the starting position for mobile image swipes.
    const handleTouchStart = (event) => {
        setTouchStart(event.touches[0].clientX);
    };

    // Changes the gallery image after a horizontal swipe.
    const handleTouchEnd = (event) => {
        if (touchStart === null) return;

        const touchEnd = event.changedTouches[0].clientX;
        const distance = touchStart - touchEnd;

        if (Math.abs(distance) > 45) {
            changeImage(distance > 0 ? 1 : -1);
        }

        setTouchStart(null);
    };

    // Adds the chosen product variant to the cart and displays the result.
    const handleAddToCart = () => {
        setCartMessage("");

        if (product.sizes.length > 0 && !selectedSize) {
            setCartMessage("Please select a size.");
            setCartMessageType("error");
            return;
        }

        if (product.colors.length > 0 && !selectedColor) {
            setCartMessage("Please select a color.");
            setCartMessageType("error");
            return;
        }

        if (isOutOfStock || quantity > product.stock) {
            setCartMessage("This product is currently unavailable.");
            setCartMessageType("error");
            return;
        }

        const result = addToCart(
            product.id,
            Number(quantity),
            selectedSize,
            selectedColor
        );

        setCartMessage(result.message);
        setCartMessageType(result.success ? "success" : "error");
    };

    // Toggles the wishlist or redirects guests to the login page.
    const handleWishlistClick = () => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: location } });
            return;
        }

        toggleWishlist(product);
    };

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            {/* Breadcrumb navigation */}
            <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <Link to="/" className="transition hover:text-gray-900">
                    Home
                </Link>

                <i className="ri-arrow-right-s-line" aria-hidden="true" />

                <Link to="/products" className="transition hover:text-gray-900">
                    Products
                </Link>

                <i className="ri-arrow-right-s-line" aria-hidden="true" />

                <span className="max-w-48 truncate text-gray-900">
                    {product.title}
                </span>
            </nav>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-16">
                {/* Product image gallery */}
                <section className="min-w-0">
                    <div
                        className="group relative overflow-hidden rounded-2xl bg-gray-50"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {images.length > 0 ? (
                            <img
                                key={images[currentImage]}
                                src={images[currentImage]}
                                alt={`${product.title}, image ${currentImage + 1}`}
                                className="w-full object-cover animate-[fadeIn_300ms_ease-in-out] "
                            />
                        ) : (
                            <div className="flex aspect-[4/5] items-center justify-center text-sm text-gray-400">
                                Product image unavailable
                            </div>
                        )}

                        {product.discount > 0 && (
                            <span className="absolute left-4 top-4 rounded-full bg-gray-950 px-3 py-1.5 text-xs font-semibold text-white">
                                SAVE {product.discount}%
                            </span>
                        )}

                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => changeImage(-1)}
                                    aria-label="Previous product image"
                                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-gray-900 shadow transition hover:bg-white"
                                >
                                    <i className="ri-arrow-left-s-line" aria-hidden="true" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => changeImage(1)}
                                    aria-label="Next product image"
                                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-gray-900 shadow transition hover:bg-white"
                                >
                                    <i className="ri-arrow-right-s-line" aria-hidden="true" />
                                </button>

                                <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700">
                                    {currentImage + 1} / {images.length}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Clickable image thumbnails */}
                    {images.length > 1 && (
                        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                            {images.map((image, index) => (
                                <button
                                    key={`${image}-${index}`}
                                    type="button"
                                    onClick={() => selectImage(index)}
                                    aria-label={`View product image ${index + 1}`}
                                    aria-pressed={currentImage === index}
                                    className={`w-20 shrink-0 overflow-hidden rounded-xl border-2 transition sm:w-24 ${currentImage === index
                                            ? "border-gray-950"
                                            : "border-transparent hover:border-gray-300"
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.title} thumbnail ${index + 1}`}
                                        loading="lazy"
                                        className="aspect-[4/5] w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                {/* Product information and purchase controls */}
                <section className="flex min-w-0 flex-col lg:sticky lg:top-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                        {product.brand}
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                        {product.title}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-gray-800">
                            <i className="ri-star-fill text-amber-400" aria-hidden="true" />
                            {product.rating}
                        </span>

                        <span className="text-gray-300">|</span>

                        <span className="text-gray-500">{product.category}</span>

                        <span className="text-gray-300">|</span>

                        <span className={isOutOfStock ? "text-red-600" : "text-green-700"}>
                            {isOutOfStock ? "Out of stock" : "In stock"}
                        </span>
                    </div>

                    {/* Pricing */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <span className="text-3xl font-semibold text-gray-950">
                            ₹{discountedPrice.toLocaleString("en-IN")}
                        </span>

                        {product.discount > 0 && (
                            <>
                                <span className="text-lg text-gray-400 line-through">
                                    ₹{product.price.toLocaleString("en-IN")}
                                </span>

                                <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                                    {product.discount}% off
                                </span>
                            </>
                        )}
                    </div>

                    <p className="mt-6 text-sm leading-7 text-gray-600 sm:text-base">
                        {product.description}
                    </p>

                    <div className="my-7 border-t border-gray-100" />

                    {/* Size selection */}
                    {product.sizes.length > 0 && (
                        <div>
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <h2 className="text-sm font-semibold text-gray-900">
                                    Select size
                                </h2>

                                {selectedSize && (
                                    <span className="text-sm text-gray-500">
                                        Selected: {selectedSize}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => setSelectedSize(size)}
                                        aria-pressed={selectedSize === size}
                                        className={`min-w-12 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${selectedSize === size
                                                ? "border-gray-950 bg-gray-950 text-white"
                                                : "border-gray-200 text-gray-700 hover:border-gray-950"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Color selection */}
                    {product.colors.length > 0 && (
                        <div className="mt-6">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <h2 className="text-sm font-semibold text-gray-900">
                                    Select color
                                </h2>

                                {selectedColor && (
                                    <span className="text-sm text-gray-500">
                                        {selectedColor}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setSelectedColor(color)}
                                        aria-pressed={selectedColor === color}
                                        className={`rounded-lg border px-4 py-2.5 text-sm transition ${selectedColor === color
                                                ? "border-gray-950 bg-gray-950 text-white"
                                                : "border-gray-200 text-gray-700 hover:border-gray-950"
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity controls */}
                    <div className="mt-6">
                        <h2 className="mb-3 text-sm font-semibold text-gray-900">
                            Quantity
                        </h2>

                        <div className="inline-flex items-center rounded-xl border border-gray-200">
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((current) => Math.max(1, current - 1))
                                }
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                                className="px-4 py-3 text-gray-700 disabled:opacity-40"
                            >
                                −
                            </button>

                            <span className="min-w-10 text-center text-sm font-medium">
                                {quantity}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((current) =>
                                        Math.min(product.stock, current + 1)
                                    )
                                }
                                disabled={quantity >= product.stock || isOutOfStock}
                                aria-label="Increase quantity"
                                className="px-4 py-3 text-gray-700 disabled:opacity-40"
                            >
                                +
                            </button>
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                            {isOutOfStock
                                ? "Currently unavailable"
                                : `${product.stock} units available`}
                        </p>
                    </div>

                    {/* Shopping actions */}
                    <div className="mt-7 grid grid-cols-[1fr_auto] gap-3">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className="flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            <i className="ri-shopping-bag-3-line text-lg" aria-hidden="true" />
                            {isOutOfStock ? "Out of stock" : "Add to cart"}
                        </button>

                        <button
                            type="button"
                            onClick={handleWishlistClick}
                            aria-label={
                                isProductWishlisted
                                    ? "Remove from wishlist"
                                    : "Add to wishlist"
                            }
                            aria-pressed={isProductWishlisted}
                            className="flex h-full min-w-14 items-center justify-center rounded-xl border border-gray-200 transition hover:border-gray-950"
                        >
                            <i
                                className={`ri-poker-hearts-fill text-xl ${isProductWishlisted ? "text-red-500" : "text-gray-600"
                                    }`}
                                aria-hidden="true"
                            />
                        </button>
                    </div>

                    {cartMessage && (
                        <p
                            role="status"
                            aria-live="polite"
                            className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium ${cartMessageType === "success"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-600"
                                }`}
                        >
                            {cartMessage}
                        </p>
                    )}

                    {/* Shopping reassurance */}
                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
                        <div className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
                            <i className="ri-truck-line text-lg" aria-hidden="true" />
                            Easy delivery
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
                            <i className="ri-shield-check-line text-lg" aria-hidden="true" />
                            Secure shopping
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default ProductDetails;