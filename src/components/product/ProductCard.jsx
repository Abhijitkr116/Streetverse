import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

// Displays one product with a navigable image carousel.
const ProductCard = ({ product }) => {
    const { toggleWishlist, isWishlisted } = useWishlist();
    const { isAuthenticated } = useAuth();

    const [currentImage, setCurrentImage] = useState(0);

    const images =
        product.images?.length > 0
            ? product.images
            : [product.image];

    // Moves to the previous or next image without changing the product.
    const changeImage = (direction) => {
        setCurrentImage((current) =>
            (current + direction + images.length) % images.length
        );
    };

    // Adds or removes the product from the user's wishlist.
    const handleWishlistClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!isAuthenticated) {
            window.location.href = "/login";
            return;
        }

        toggleWishlist(product);
    };

    const discountedPrice = Math.round(
        product.price * (1 - product.discount / 100)
    );

    return (
        <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative overflow-hidden bg-gray-50">
                <Link to={`/products/${product.id}`}>
                    <img
                        src={images[currentImage]}
                        alt={product.title}
                        className="aspect-[3/4] w-full object-cover transition duration-500"
                    />
                </Link>

                {product.discount > 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-gray-950 px-2.5 py-1 text-xs font-semibold text-white">
                        -{product.discount}%
                    </span>
                )}

                <button
                    type="button"
                    onClick={handleWishlistClick}
                    aria-label={
                        isWishlisted(product.id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"
                >
                    <i
                        className={`ri-poker-hearts-fill text-lg ${
                            isWishlisted(product.id)
                                ? "text-red-500"
                                : "text-gray-500"
                        }`}
                        aria-hidden="true"
                    />
                </button>

                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => changeImage(-1)}
                            aria-label="Previous image"
                            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 opacity-100 shadow transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
                        >
                            <i className="ri-arrow-left-s-line" aria-hidden="true" />
                        </button>

                        <button
                            type="button"
                            onClick={() => changeImage(1)}
                            aria-label="Next image"
                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 opacity-100 shadow transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
                        >
                            <i className="ri-arrow-right-s-line" aria-hidden="true" />
                        </button>

                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                            {images.map((image, index) => (
                                <button
                                    key={image}
                                    type="button"
                                    onClick={() => setCurrentImage(index)}
                                    aria-label={`Show image ${index + 1}`}
                                    className={`h-1.5 rounded-full transition-all ${
                                        currentImage === index
                                            ? "w-5 bg-gray-950"
                                            : "w-1.5 bg-white/80"
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="p-3 sm:p-4">
                <p className="text-xs text-gray-500">{product.brand}</p>

                <Link to={`/products/${product.id}`}>
                    <h3 className="mt-1 line-clamp-2 text-sm font-medium text-gray-900 hover:text-gray-600 sm:text-base">
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
                    <i className="ri-star-fill text-amber-400" aria-hidden="true" />
                    {product.rating}
                </p>
            </div>
        </article>
    );
};

export default ProductCard;
