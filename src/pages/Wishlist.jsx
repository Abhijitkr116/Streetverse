import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/product/ProductCard";

const Wishlist = () => {
    const {
        wishlistItems,
        wishlistCount,
        clearWishlist,
    } = useWishlist();

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Wishlist
                    </h1>

                    <p className="mt-2 text-gray-500">
                        {wishlistCount} saved{" "}
                        {wishlistCount === 1 ? "product" : "products"}
                    </p>
                </div>

                {wishlistCount > 0 && (
                    <button
                        type="button"
                        onClick={clearWishlist}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                        Clear Wishlist
                    </button>
                )}
            </div>

            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {wishlistItems.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-20 text-center">
                    <div className="text-5xl">♡</div>

                    <h2 className="mt-5 text-xl font-semibold text-gray-900">
                        Your wishlist is empty
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Save your favorite products to find them here.
                    </p>

                    <Link
                        to="/products"
                        className="mt-6 inline-block rounded-xl bg-gray-900 px-6 py-3 font-semibold !text-white transition hover:bg-gray-700"
                    >
                        Explore Products
                    </Link>
                </div>
            )}
        </section>
    );
};

export default Wishlist;