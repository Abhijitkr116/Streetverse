import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Manages checkout form state, order submission, and order summary display.
const Checkout = () => {
    const { cartItems, subtotal, clearCart } = useCart();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        paymentMethod: "cod",
    });

    const [message, setMessage] = useState("");

    // Updates the relevant checkout field when the user enters or changes a value.
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Validates checkout data, saves the order locally, clears the cart, and navigates to order history.
    const handleSubmit = (event) => {
        event.preventDefault();

        if (cartItems.length === 0) {
            setMessage("Your cart is empty.");
            return;
        }

        const order = {
            id: `ORD-${Date.now()}`,
            date: new Date().toISOString(),
            customer: {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
            },
            items: cartItems.map((item) => ({ ...item })),
            subtotal,
            shipping: 0,
            total: subtotal,
            paymentMethod: formData.paymentMethod,
            status: "Confirmed",
        };

        try {
            const savedOrders = JSON.parse(
                localStorage.getItem("shopease-orders") || "[]"
            );

            if (!Array.isArray(savedOrders)) {
                throw new Error("Invalid order data");
            }

            localStorage.setItem(
                "shopease-orders",
                JSON.stringify([order, ...savedOrders])
            );

            clearCart();

            navigate("/orders", {
                state: {
                    orderPlaced: true,
                    orderNumber: order.id,
                },
            });
        } catch {
            setMessage(
                "Unable to save your order. Please check browser storage and try again."
            );
        }
    };

    // Formats numeric prices as Indian Rupee currency.
    const formatPrice = (price) =>
        `₹${price.toLocaleString("en-IN")}`;

    if (cartItems.length === 0) {
        return (
            <section className="mx-auto max-w-3xl px-4 py-20 text-center">
                <i className="ri-shopping-cart-line text-6xl text-gray-300"></i>

                <h1 className="mt-4 text-2xl font-bold text-gray-900">
                    Your cart is empty
                </h1>

                <p className="mt-2 text-gray-500">
                    Add some products before proceeding to checkout.
                </p>

                <Link
                    to="/products"
                    className="mt-6 inline-flex rounded-lg bg-gray-900 px-6 py-3 font-semibold !text-white hover:bg-gray-700"
                >
                    Browse Products
                </Link>
            </section>
        );
    }

    return (
        <section className="bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <Link
                        to="/cart"
                        className="text-sm text-gray-500 hover:text-gray-900"
                    >
                        <i className="ri-arrow-left-line mr-2"></i>
                        Back to Cart
                    </Link>

                    <h1 className="mt-4 text-3xl font-bold text-gray-900">
                        Checkout
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Enter your details to complete your order.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Customer and shipping details */}
                        <div className="space-y-6 lg:col-span-2">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                                    <i className="ri-user-line mr-2"></i>
                                    Contact Information
                                </h2>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="fullName"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            autoComplete="name"
                                            required
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="phone"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            autoComplete="tel"
                                            required
                                            pattern="[0-9]{10}"
                                            maxLength={10}
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="10-digit mobile number"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Enter a 10-digit mobile number.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                                    <i className="ri-map-pin-line mr-2"></i>
                                    Shipping Address
                                </h2>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="address"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Street Address
                                        </label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            autoComplete="street-address"
                                            required
                                            rows={3}
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="House number, street, area"
                                            className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="city"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            City
                                        </label>
                                        <input
                                            id="city"
                                            name="city"
                                            type="text"
                                            autoComplete="address-level2"
                                            required
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="state"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            State
                                        </label>
                                        <input
                                            id="state"
                                            name="state"
                                            type="text"
                                            autoComplete="address-level1"
                                            required
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="State"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="postalCode"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            PIN Code
                                        </label>
                                        <input
                                            id="postalCode"
                                            name="postalCode"
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete="postal-code"
                                            pattern="[0-9]{6}"
                                            maxLength={6}
                                            required
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            placeholder="6-digit PIN code"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Demo payment selection */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                                    <i className="ri-wallet-3-line mr-2"></i>
                                    Payment Method
                                </h2>

                                <div className="space-y-3">
                                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === "cod"}
                                            onChange={handleChange}
                                            className="h-4 w-4 accent-gray-900"
                                        />
                                        <i className="ri-hand-coin-line text-xl text-gray-600"></i>
                                        <span className="flex-1">
                                            <span className="block font-medium text-gray-900">
                                                Cash on Delivery
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Pay when your order arrives.
                                            </span>
                                        </span>
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="upi"
                                            checked={formData.paymentMethod === "upi"}
                                            onChange={handleChange}
                                            className="h-4 w-4 accent-gray-900"
                                        />
                                        <i className="ri-smartphone-line text-xl text-gray-600"></i>
                                        <span className="flex-1">
                                            <span className="block font-medium text-gray-900">
                                                UPI
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Demo selection only. No payment is processed.
                                            </span>
                                        </span>
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={formData.paymentMethod === "card"}
                                            onChange={handleChange}
                                            className="h-4 w-4 accent-gray-900"
                                        />
                                        <i className="ri-bank-card-line text-xl text-gray-600"></i>
                                        <span className="flex-1">
                                            <span className="block font-medium text-gray-900">
                                                Credit / Debit Card
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Demo selection only. No card details required.
                                            </span>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Order summary */}
                        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Order Summary
                            </h2>

                            <div className="mt-6 max-h-80 space-y-4 overflow-y-auto">
                                // Creates a copy of each cart item for the saved order.
                                {cartItems.map((item) => {
                                    // Calculates the discounted unit price for the order summary.
                                    const unitPrice = Math.round(
                                        item.price * (1 - (item.discount || 0) / 100)
                                    );

                                    return (
                                        <div
                                            key={`${item.id}-${item.size}-${item.color}`}
                                            className="flex gap-4"
                                        >
                                            <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
                                                    {item.title}
                                                </h3>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Qty: {item.quantity}
                                                    {item.size ? ` · Size: ${item.size}` : ""}
                                                    {item.color ? ` · ${item.color}` : ""}
                                                </p>

                                                <p className="mt-2 font-semibold text-gray-900">
                                                    {formatPrice(unitPrice * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="my-6 border-t border-gray-200"></div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between gap-4 text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>

                                <div className="flex justify-between gap-4 text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-medium text-green-600">FREE</span>
                                </div>
                            </div>

                            <div className="my-6 border-t border-gray-200"></div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-lg font-semibold text-gray-900">
                                    Total
                                </span>
                                <span className="text-2xl font-bold text-gray-900">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>

                            <p className="mt-3 text-xs text-gray-500">
                                Final order details will be saved locally in this demo.
                            </p>

                            {message && (
                                <p
                                    role="status"
                                    className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
                                >
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="mt-6 w-full rounded-lg bg-gray-900 px-5 py-4 font-semibold !text-white transition hover:bg-gray-700"
                            >
                                Place Order
                                <i className="ri-arrow-right-line ml-2"></i>
                            </button>

                            <p className="mt-4 text-center text-xs text-gray-500">
                                <i className="ri-shield-check-line mr-1"></i>
                                Demo checkout. No real payment is taken.
                            </p>
                        </aside>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Checkout;
