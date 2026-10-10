import { useState } from "react";
import { Link } from "react-router-dom";

// Renders a modern footer with shopping links, support information, and newsletter signup.
const Footer = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    // Handles newsletter form submission for this frontend-only demo.
    const handleNewsletterSubmit = (event) => {
        event.preventDefault();

        if (!email.trim()) {
            setMessage("Please enter your email address.");
            return;
        }

        setMessage("Thanks for your interest in StreetVerse!");
        setEmail("");
    };

    // Provides the current year for the copyright notice.
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-16 bg-black text-gray-300">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Brand section */}
                    <div>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-white"
                        >
                            <img
                                src="/SVLogo.png"
                                alt="StreetVerse logo"
                                className="h-10 w-10 object-contain"
                            />
                            <span>StreetVerse</span>
                        </Link>

                        <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
                            Wear your story. Discover everyday essentials
                            that bring comfort, confidence, and street style
                            together.
                        </p>

                        <div className="mt-5 flex gap-4">
                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="text-xl transition hover:text-white"
                            >
                                <i className="ri-instagram-line" />
                            </a>

                            <a
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="text-xl transition hover:text-white"
                            >
                                <i className="ri-facebook-circle-line" />
                            </a>

                            <a
                                href="https://www.pinterest.com/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Pinterest"
                                className="text-xl transition hover:text-white"
                            >
                                <i className="ri-pinterest-line" />
                            </a>
                        </div>
                    </div>

                    {/* Shopping links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-white">
                            Shop
                        </h3>

                        <ul className="mt-5 space-y-3 text-sm">
                            <li>
                                <Link
                                    to="/products?category=T-Shirts"
                                    className="transition hover:text-white"
                                >
                                    T-Shirts
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/products?category=Jeans"
                                    className="transition hover:text-white"
                                >
                                    Jeans
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/products?category=Sneakers"
                                    className="transition hover:text-white"
                                >
                                    Sneakers
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/products?category=Accessories"
                                    className="transition hover:text-white"
                                >
                                    Accessories
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/products"
                                    className="transition hover:text-white"
                                >
                                    All Categories
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer support links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-white">
                            Customer Care
                        </h3>

                        <ul className="mt-5 space-y-3 text-sm">
                            <li>
                                <Link
                                    to="/orders"
                                    className="transition hover:text-white"
                                >
                                    My Orders
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/wishlist"
                                    className="transition hover:text-white"
                                >
                                    My Wishlist
                                </Link>
                            </li>

                            <li>
                                <a
                                    href="mailto:support@streetverse.com"
                                    className="transition hover:text-white"
                                >
                                    Contact Us
                                </a>
                            </li>

                            <li>
                                <a
                                    href="mailto:support@streetverse.com?subject=Returns%20and%20Refunds"
                                    className="transition hover:text-white"
                                >
                                    Returns & Refunds
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter section */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-white">
                            Stay in the Loop
                        </h3>

                        <p className="mt-5 text-sm leading-6 text-gray-400">
                            Get updates on new arrivals, fresh styles, and
                            exclusive offers.
                        </p>

                        <form
                            onSubmit={handleNewsletterSubmit}
                            className="mt-4"
                        >
                            <label
                                htmlFor="newsletter-email"
                                className="sr-only"
                            >
                                Email address
                            </label>

                            <div className="flex overflow-hidden rounded-lg border border-gray-700 bg-gray-900 focus-within:border-gray-400">
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="Your email address"
                                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-gray-500"
                                />

                                <button
                                    type="submit"
                                    aria-label="Subscribe to newsletter"
                                    className="px-4 text-white transition hover:bg-gray-800"
                                >
                                    <i className="ri-arrow-right-line text-xl" />
                                </button>
                            </div>

                            {message && (
                                <p
                                    role="status"
                                    className="mt-3 text-xs text-gray-300"
                                >
                                    {message}
                                </p>
                            )}
                        </form>

                        <p className="mt-3 text-xs text-gray-500">
                            Newsletter signup is a frontend demo and does
                            not store or send email addresses.
                        </p>
                    </div>
                </div>

                {/* Copyright and bottom navigation */}
                <div className="mt-12 flex flex-col gap-4 border-t border-gray-800 pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {currentYear} StreetVerse. All rights reserved.
                    </p>

                    <Link
                        to="/"
                        className="transition hover:text-white"
                    >
                        Wear Your Story.
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;