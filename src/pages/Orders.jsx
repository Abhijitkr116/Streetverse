
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Orders = () => {
    const location = useLocation();

    const [orders] = useState(() => {
        try {
            const saved = JSON.parse(
                localStorage.getItem("shopease-orders") || "[]"
            );

            return Array.isArray(saved) ? saved : [];
        } catch {
            return [];
        }
    });

    const formatPrice = (price) =>
        `₹${Number(price).toLocaleString("en-IN")}`;

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    return (
        <section className="min-h-[60vh] bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                {location.state?.orderPlaced && (
                    <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-6">
                        <div className="flex items-center gap-3">
                            <i className="ri-checkbox-circle-fill text-3xl text-green-600"></i>

                            <div>
                                <h1 className="text-xl font-bold text-green-800">
                                    Order placed successfully!
                                </h1>

                                <p className="mt-1 text-sm text-green-700">
                                    Order number: {location.state.orderNumber}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Orders
                        </h1>
                        <p className="mt-2 text-gray-500">
                            View your order history and details.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="rounded-lg bg-gray-900 px-5 py-3 font-semibold !text-white hover:bg-gray-700"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                        <i className="ri-file-list-3-line text-6xl text-gray-300"></i>

                        <h2 className="mt-4 text-xl font-semibold text-gray-900">
                            No orders yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Your placed orders will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <article
                                key={order.id}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-gray-50 p-5">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Order number
                                        </p>
                                        <p className="mt-1 font-semibold text-gray-900">
                                            {order.id}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Order date
                                        </p>
                                        <p className="mt-1 font-medium text-gray-900">
                                            {formatDate(order.date)}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 p-5">
                                    {order.items.map((item, index) => {
                                        const unitPrice = Math.round(
                                            item.price *
                                            (1 - (item.discount || 0) / 100)
                                        );

                                        return (
                                            <div
                                                key={`${item.id}-${item.size}-${item.color}-${index}`}
                                                className="flex items-center gap-4"
                                            >
                                                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-medium text-gray-900">
                                                        {item.title}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Qty: {item.quantity}
                                                        {item.size ? ` · Size: ${item.size}` : ""}
                                                        {item.color ? ` · ${item.color}` : ""}
                                                    </p>
                                                </div>

                                                <p className="font-semibold text-gray-900">
                                                    {formatPrice(unitPrice * item.quantity)}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 p-5">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Payment method:{" "}
                                            <span className="font-medium uppercase text-gray-700">
                                                {order.paymentMethod}
                                            </span>
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Ship to: {order.customer.city},{" "}
                                            {order.customer.state}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            Order total
                                        </p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {formatPrice(order.total)}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Orders;
