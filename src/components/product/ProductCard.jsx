import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

// Displays a product card with a responsive, touch-enabled image carousel.
const ProductCard = ({ product }) => {
    const { toggleWishlist, isWishlisted } = useWishlist();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [currentImage, setCurrentImage] = useState(0);
    const [touchStart, setTouchStart] = useState(null);

    const images =
        product.images?.length > 0
            ? product.images
            : product.image
                ? [product.image]
                : [];

    // Changes the active image and wraps around at either end.
    const changeImage = (direction) => {
        if (images.length < 2) return;

        setCurrentImage(
            (current) => (current + direction + images.length) % images.length
        );
    };

    // Opens the login page for guests or toggles the authenticated user's wishlist.
    const handleWishlistClick = () => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: location } });
            return;
        }

        toggleWishlist(product);
    };

    // Records the starting horizontal position of a mobile swipe.
    const handleTouchStart = (event) => {
        setTouchStart(event.touches[0].clientX);
    };

    // Changes images when the user swipes horizontally across the image.
    const handleTouchEnd = (event) => {
        if (touchStart === null) return;

        const touchEnd = event.changedTouches[0].clientX;
        const distance = touchStart - touchEnd;

        if (Math.abs(distance) > 45) {
            changeImage(distance > 0 ? 1 : -1);
        }

        setTouchStart(null);
    };

    const discountedPrice = Math.round(
        product.price * (1 - product.discount / 100)
    );

    const wishlisted = isWishlisted(product.id);

    return (
        <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            {/* Product image carousel */}
            <div
                className="relative overflow-hidden bg-gray-50"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <Link
                    to={`/products/${product.id}`}
                    className="block"
                    aria-label={`View ${product.title}`}
                >
                    {images.length > 0 ? (
                        <img
                            key={images[currentImage]}
                            src={images[currentImage]}
                            alt={`${product.title}, image ${currentImage + 1}`}
                            loading="lazy"
                            draggable="false"
                            className="aspect-[3/4] w-full object-cover animate-[fadeIn_300ms_ease-in-out]"
                        />
                    ) : (
                        <div className="flex aspect-[3/4] items-center justify-center text-sm text-gray-400">
                            Image unavailable
                        </div>
                    )}
                </Link>

                {/* Discount badge */}
                {product.discount > 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-gray-950 px-2.5 py-1 text-xs font-semibold text-white">
                        -{product.discount}%
                    </span>
                )}

                {/* Wishlist button */}
                <button
                    type="button"
                    onClick={handleWishlistClick}
                    aria-label={
                        wishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                    aria-pressed={wishlisted}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-110"
                >
                    <i
                        className={`ri-poker-hearts-fill text-lg transition-colors ${wishlisted
                                ? "text-red-500"
                                : "text-gray-500 hover:text-red-500"
                            }`}
                        aria-hidden="true"
                    />
                </button>

                {/* Previous and next controls */}
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => changeImage(-1)}
                            aria-label="Previous product image"
                            className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-xl text-gray-900 shadow transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
                        >
                            <i
                                className="ri-arrow-left-s-line"
                                aria-hidden="true"
                            />
                        </button>

                        <button
                            type="button"
                            onClick={() => changeImage(1)}
                            aria-label="Next product image"
                            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-xl text-gray-900 shadow transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
                        >
                            <i
                                className="ri-arrow-right-s-line"
                                aria-hidden="true"
                            />
                        </button>

                        {/* Carousel indicators */}
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                            {images.map((image, index) => (
                                <button
                                    key={`${image}-${index}`}
                                    type="button"
                                    onClick={() => setCurrentImage(index)}
                                    aria-label={`Show image ${index + 1}`}
                                    aria-current={
                                        currentImage === index ? "true" : undefined
                                    }
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentImage === index
                                            ? "w-5 bg-gray-950"
                                            : "w-1.5 bg-white shadow"
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Product information */}
            <div className="p-3 sm:p-4">
                <p className="text-xs text-gray-500">{product.brand}</p>

                <Link to={`/products/${product.id}`}>
                    <h3 className="mt-1 line-clamp-2 text-sm font-medium text-gray-900 transition hover:text-gray-600 sm:text-base">
                        {product.title}
                    </h3>
                </Link>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-950">
                        ₹{discountedPrice.toLocaleString("en-IN")}
                    </span>

                    {product.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                            ₹{product.price.toLocaleString("en-IN")}
                        </span>
                    )}
                </div>

                <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                    <i
                        className="ri-star-fill text-amber-400"
                        aria-hidden="true"
                    />
                    {product.rating}
                </p>
            </div>
        </article>
    );
};

export default ProductCard;
