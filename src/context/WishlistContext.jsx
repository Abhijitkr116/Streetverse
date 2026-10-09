
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import products from "../data/Product";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

// Returns the storage key belonging to the current account.
const getWishlistKey = (userId) => `shopease-wishlist-${userId}`;

// Loads the wishlist for a specific account from localStorage.
const loadWishlist = (userId) => {
    if (!userId) return [];

    try {
        const saved = JSON.parse(
            localStorage.getItem(getWishlistKey(userId)) || "[]"
        );

        if (!Array.isArray(saved)) return [];

        return [
            ...new Set(
                saved.filter(
                    (id) =>
                        Number.isInteger(id) &&
                        products.some((product) => product.id === id)
                )
            ),
        ];
    } catch {
        return [];
    }
};

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const userId = user?.id ?? null;

    const [wishlistState, setWishlistState] = useState(() => ({
        userId,
        ids: loadWishlist(userId),
    }));

    // Loads the correct wishlist whenever the active account changes.
    useEffect(() => {
        setWishlistState({
            userId,
            ids: loadWishlist(userId),
        });
    }, [userId]);

    // Saves wishlist changes only to the matching logged-in account.
    useEffect(() => {
        if (!userId || wishlistState.userId !== userId) return;

        localStorage.setItem(
            getWishlistKey(userId),
            JSON.stringify(wishlistState.ids)
        );
    }, [userId, wishlistState]);

    // Adds or removes a product from the logged-in user's wishlist.
    const toggleWishlist = (productId) => {
        if (!userId) return;

        setWishlistState((current) => {
            if (current.userId !== userId) return current;

            const exists = current.ids.includes(productId);

            return {
                ...current,
                ids: exists
                    ? current.ids.filter((id) => id !== productId)
                    : [...current.ids, productId],
            };
        });
    };

    // Checks whether a product is in the active user's wishlist.
    const isWishlisted = (productId) =>
        Boolean(
            userId &&
            wishlistState.userId === userId &&
            wishlistState.ids.includes(productId)
        );

    // Removes all wishlist items belonging to the current account.
    const clearWishlist = () => {
        if (!userId) return;

        setWishlistState((current) =>
            current.userId === userId
                ? { ...current, ids: [] }
                : current
        );
    };

    const wishlistIds =
        userId && wishlistState.userId === userId
            ? wishlistState.ids
            : [];

    const wishlistItems = products.filter((product) =>
        wishlistIds.includes(product.id)
    );

    return (
        <WishlistContext.Provider
            value={{
                wishlistIds,
                wishlistItems,
                wishlistCount: wishlistIds.length,
                toggleWishlist,
                isWishlisted,
                clearWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

// Provides wishlist state and actions to child components.
export const useWishlist = () => {
    const context = useContext(WishlistContext);

    if (!context) {
        throw new Error(
            "useWishlist must be used inside WishlistProvider"
        );
    }

    return context;
};
