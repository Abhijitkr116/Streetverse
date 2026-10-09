import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ product }) => {

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirects guests to login before allowing wishlist actions.
    const handleWishlistClick = () => {
        if (!isAuthenticated) {
            navigate("/login", {
                state: { from: location },
            });
            return;
        }

        toggleWishlist(product.id);
    };

    const discountedPrice = Math.round(
        product.price * (1 - product.discount / 100)
    );

    const { toggleWishlist, isWishlisted } = useWishlist();


    return (
        <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="relative">
                <Link
                    to={`/products/${product.id}`}
                    className="block aspect-[4/5] overflow-hidden bg-gray-100"
                >
                    <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover"
                    />
                </Link>

                <button
                    type="button"
                    onClick={handleWishlistClick}
                    aria-label={
                        isWishlisted(product.id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                    aria-pressed={isWishlisted(product.id)}
                    className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-110"
                >
                    <i
                        className={`ri-poker-hearts-fill text-xl transition-colors ${isWishlisted(product.id)
                            ? "text-red-500"
                            : "text-gray-500 hover:text-red-500"
                            }`}
                        aria-hidden="true"
                    ></i>
                </button>
            </div>

            <div className="p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                    {product.category}
                </p>

                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    <Link
                        to={`/products/${product.id}`}
                        className="transition hover:text-blue-600"
                    >
                        {product.title}
                    </Link>
                </h3>

                <p className="mb-3 text-sm text-gray-600">
                    ⭐ {product.rating} <span className="text-gray-400">/ 5</span>
                </p>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                        ₹{discountedPrice}
                    </span>

                    <span className="text-sm text-gray-400 line-through">
                        ₹{product.price}
                    </span>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;