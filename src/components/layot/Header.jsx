import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
    const { itemCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Logs out the current user and returns them to the homepage.
    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate("/");
    };

    // Closes the mobile navigation after selecting a link.
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Applies consistent styling and active-state feedback to navigation links.
    const getNavLinkClass = ({ isActive }) =>
        `block rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
            ? "bg-gray-100 text-gray-900"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`;

    return (
        <header className="relative z-50 border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="shrink-0 text-2xl font-bold tracking-tight text-gray-900"
                >
                    StreetVerse
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-1 md:flex">
                    <NavLink to="/" end className={getNavLinkClass}>
                        Home
                    </NavLink>

                    <NavLink to="/products" className={getNavLinkClass}>
                        Products
                    </NavLink>

                    <NavLink to="/wishlist" className={getNavLinkClass}>
                        Wishlist
                        {wishlistCount > 0 && (
                            <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                                {wishlistCount}
                            </span>
                        )}
                    </NavLink>

                    <NavLink to="/cart" className={getNavLinkClass}>
                        Cart
                        {itemCount > 0 && (
                            <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                                {itemCount}
                            </span>
                        )}
                    </NavLink>

                    <NavLink to="/orders" className={getNavLinkClass}>
                        Orders
                    </NavLink>
                </nav>

                {/* Desktop Authentication */}
                <div className="hidden items-center gap-3 md:flex">
                    {isAuthenticated ? (
                        <>
                            <span className="max-w-32 truncate text-sm font-medium text-gray-700">
                                Hi, {user.name}
                            </span>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-medium text-gray-700 transition hover:text-black"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center gap-3 md:hidden">
                    <Link
                        to="/wishlist"
                        aria-label={`Wishlist, ${wishlistCount} items`}
                        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-xl text-gray-700 hover:bg-gray-100"
                    >
                        <i className="ri-heart-line" aria-hidden="true"></i>

                        {wishlistCount > 0 && (
                            <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    <Link
                        to="/cart"
                        aria-label={`Cart, ${itemCount} items`}
                        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-xl text-gray-700 hover:bg-gray-100"
                    >
                        <i className="ri-shopping-cart-2-line" aria-hidden="true"></i>

                        {itemCount > 0 && (
                            <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                                {itemCount}
                            </span>
                        )}
                    </Link>

                    {/* Toggles the mobile navigation menu. */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((open) => !open)}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-navigation"
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-gray-800 transition hover:bg-gray-100"
                    >
                        <i
                            className={
                                isMenuOpen ? "ri-close-line" : "ri-menu-line"
                            }
                            aria-hidden="true"
                        ></i>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div
                    id="mobile-navigation"
                    className="border-t border-gray-200 bg-white px-4 pb-4 pt-3 shadow-lg md:hidden"
                >
                    <nav className="flex flex-col gap-1">
                        <NavLink
                            to="/"
                            end
                            className={getNavLinkClass}
                            onClick={closeMenu}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/products"
                            className={getNavLinkClass}
                            onClick={closeMenu}
                        >
                            Products
                        </NavLink>

                        <NavLink
                            to="/wishlist"
                            className={getNavLinkClass}
                            onClick={closeMenu}
                        >
                            Wishlist
                            {wishlistCount > 0 && (
                                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                                    {wishlistCount}
                                </span>
                            )}
                        </NavLink>

                        <NavLink
                            to="/cart"
                            className={getNavLinkClass}
                            onClick={closeMenu}
                        >
                            Cart
                            {itemCount > 0 && (
                                <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                                    {itemCount}
                                </span>
                            )}
                        </NavLink>

                        <NavLink
                            to="/orders"
                            className={getNavLinkClass}
                            onClick={closeMenu}
                        >
                            Orders
                        </NavLink>
                    </nav>

                    <div className="mt-3 border-t border-gray-200 pt-3">
                        {isAuthenticated ? (
                            <div className="flex items-center justify-between gap-3">
                                <span className="min-w-0 truncate text-sm font-medium text-gray-700">
                                    Hi, {user.name}
                                </span>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Link
                                    to="/login"
                                    onClick={closeMenu}
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={closeMenu}
                                    className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-center text-sm font-medium !text-white transition hover:bg-gray-700"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;