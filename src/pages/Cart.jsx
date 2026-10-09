import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
    const {
        cartItems,
        itemCount,
        subtotal,
        originalTotal,
        totalSavings,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart();

    const formatPrice = (price) =>
        `₹${price.toLocaleString("en-IN")}`;

    if (cartItems.length === 0) {
        return (
            <section className="mx-auto max-w-3xl px-4 py-24 text-center">
                <div className="text-6xl">🛒</div>

                <h1 className="mt-6 text-3xl font-bold text-gray-900">
                    Your cart is empty
                </h1>

                <p className="mt-3 text-gray-500">
                    Looks like you haven't added anything yet.
                </p>

                <Link
                    to="/products"
                    className="mt-8 inline-block rounded-xl bg-gray-900 px-6 py-3 font-semibold !text-white transition hover:bg-gray-700"
                >
                    Explore Products
                </Link>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Shopping Cart
                    </h1>

                    <p className="mt-2 text-gray-500">
                        {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                    </p>
                </div>

                <button
                    type="button"
                    onClick={clearCart}
                    className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                    Clear Cart
                </button>
            </div>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    {cartItems.map((item) => {
                        const unitPrice = Math.round(
                            item.price * (1 - item.discount / 100)
                        );

                        return (
                            <article
                                key={`${item.productId}-${item.size}-${item.color}`}
                                className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row"
                            >
                                <Link
                                    to={`/products/${item.productId}`}
                                    className="h-36 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-32"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-contain p-2"
                                    />
                                </Link>

                                <div className="flex min-w-0 flex-1 flex-col">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <Link
                                                to={`/products/${item.productId}`}
                                                className="font-semibold text-gray-900 hover:text-blue-600"
                                            >
                                                {item.title}
                                            </Link>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {item.brand}
                                            </p>

                                            {item.size && (
                                                <p className="mt-2 text-sm text-gray-600">
                                                    Size: {item.size}
                                                </p>
                                            )}

                                            {item.color && (
                                                <p className="text-sm text-gray-600">
                                                    Color: {item.color}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFromCart(
                                                    item.productId,
                                                    item.size,
                                                    item.color
                                                )
                                            }
                                            aria-label={`Remove ${item.title} from cart`}
                                            className="text-sm font-medium text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
                                        <div className="flex items-center rounded-lg border border-gray-200">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.productId,
                                                        item.size,
                                                        item.color,
                                                        item.quantity - 1
                                                    )
                                                }
                                                aria-label={`Decrease ${item.title} quantity`}
                                                className="px-3 py-2"
                                            >
                                                −
                                            </button>

                                            <span className="min-w-9 text-center text-sm">
                                                {item.quantity}
                                            </span>

                                            <button
                                                type="button"
                                                disabled={item.quantity >= item.stock}
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.productId,
                                                        item.size,
                                                        item.color,
                                                        item.quantity + 1
                                                    )
                                                }
                                                aria-label={`Increase ${item.title} quantity`}
                                                className="px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">
                                                {formatPrice(unitPrice * item.quantity)}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {formatPrice(unitPrice)} each
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <aside className="rounded-2xl border border-gray-200 p-6 lg:sticky lg:top-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        Order Summary
                    </h2>

                    <div className="mt-6 space-y-4 text-sm">
                        <div className="flex justify-between gap-4 text-gray-600">
                            <span>Original price</span>
                            <span>{formatPrice(originalTotal)}</span>
                        </div>

                        <div className="flex justify-between gap-4 text-green-600">
                            <span>You save</span>
                            <span>−{formatPrice(totalSavings)}</span>
                        </div>

                        <div className="flex justify-between gap-4 text-gray-600">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between gap-4 text-base font-bold text-gray-900">
                                <span>Total</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/checkout"
                        className="mt-6 block rounded-xl bg-gray-900 px-5 py-3 text-center font-semibold !text-white transition hover:bg-gray-700"
                    >
                        Proceed to Checkout
                    </Link>

                    <Link
                        to="/products"
                        className="mt-4 block text-center text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        Continue Shopping
                    </Link>
                </aside>
            </div>
        </section>
    );
};

export default Cart;