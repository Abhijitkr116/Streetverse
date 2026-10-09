import { createContext, useContext, useEffect, useState } from "react";
import products from "../data/Product";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

// Returns a separate storage key for each user and for guests.
const getCartStorageKey = (userId) =>
    userId ? `shopease-cart-${userId}` : "shopease-cart-guest";

// Loads and validates saved cart entries from localStorage.
const getInitialCart = (userId) => {
    try {
        const saved = localStorage.getItem(getCartStorageKey(userId));
        const parsed = saved ? JSON.parse(saved) : [];

        if (!Array.isArray(parsed)) return [];

        return parsed.filter((item) => {
            if (!item || typeof item !== "object" || Array.isArray(item)) {
                return false;
            }

            const product = products.find(
                (product) => product.id === item.productId
            );

            if (
                !product ||
                !Number.isSafeInteger(item.quantity) ||
                item.quantity < 1 ||
                item.quantity > product.stock ||
                typeof item.size !== "string" ||
                typeof item.color !== "string"
            ) {
                return false;
            }

            const validSize =
                !product.sizes?.length ||
                product.sizes.includes(item.size);

            const validColor =
                !product.colors?.length ||
                product.colors.includes(item.color);

            return validSize && validColor;
        });
    } catch {
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const userId = user?.id ?? null;

    // Tracks which account owns the cart currently held in memory.
    const [cartState, setCartState] = useState(() => ({
        userId,
        items: getInitialCart(userId),
    }));

    // Loads the correct cart whenever the active account changes.
    useEffect(() => {
        setCartState({
            userId,
            items: getInitialCart(userId),
        });
    }, [userId]);

    // Saves cart changes only after the correct account's cart has loaded.
    useEffect(() => {
        if (cartState.userId !== userId) return;

        try {
            localStorage.setItem(
                getCartStorageKey(userId),
                JSON.stringify(cartState.items)
            );
        } catch {
            console.error("Unable to save cart to localStorage.");
        }
    }, [cartState, userId]);

    // Returns only the cart belonging to the currently active account.
    const cart =
        cartState.userId === userId
            ? cartState.items
            : [];

    // Adds a product or increases its quantity for the selected variant.
    const addToCart = (
        productOrId,
        quantity = 1,
        size = "",
        color = ""
    ) => {
        const productId =
            typeof productOrId === "object"
                ? productOrId?.id
                : productOrId;

        const product = products.find(
            (item) => item.id === productId
        );

        // Converts and validates the requested quantity.
        const parsedQuantity = Number(quantity);

        if (!product) {
            return {
                success: false,
                message: "Product not found.",
            };
        }

        if (
            !Number.isSafeInteger(parsedQuantity) ||
            parsedQuantity < 1
        ) {
            return {
                success: false,
                message: "Invalid quantity.",
            };
        }

        if (
            product.sizes?.length &&
            !product.sizes.includes(size)
        ) {
            return {
                success: false,
                message: "Please select a valid size.",
            };
        }

        if (
            product.colors?.length &&
            !product.colors.includes(color)
        ) {
            return {
                success: false,
                message: "Please select a valid color.",
            };
        }

        // Finds the selected product variant in the active cart.
        const existingItem = cart.find(
            (item) =>
                item.productId === productId &&
                item.size === size &&
                item.color === color
        );

        // Calculates the combined quantity before updating the cart.
        const nextQuantity =
            (existingItem?.quantity ?? 0) + parsedQuantity;

        if (nextQuantity > product.stock) {
            return {
                success: false,
                message: `Only ${product.stock} units are available.`,
            };
        }

        // Adds the item only if the active account still owns this cart.
        setCartState((current) => {
            if (current.userId !== userId) return current;

            const existing = current.items.find(
                (item) =>
                    item.productId === productId &&
                    item.size === size &&
                    item.color === color
            );

            if (existing) {
                const updatedQuantity =
                    existing.quantity + parsedQuantity;

                // Prevents the combined quantity from exceeding stock.
                if (updatedQuantity > product.stock) return current;

                return {
                    ...current,
                    items: current.items.map((item) =>
                        item.productId === productId &&
                            item.size === size &&
                            item.color === color
                            ? { ...item, quantity: updatedQuantity }
                            : item
                    ),
                };
            }

            // Adds a new product variant to the cart.
            return {
                ...current,
                items: [
                    ...current.items,
                    {
                        productId,
                        size,
                        color,
                        quantity: parsedQuantity,
                    },
                ],
            };
        });

        return {
            success: true,
            message: "Product added to cart.",
        };
    };

    // Changes the quantity of a specific product variant.
    const updateQuantity = (
        productId,
        size,
        color,
        quantity
    ) => {
        const product = products.find(
            (item) => item.id === productId
        );

        // Converts and validates the new quantity.
        const parsedQuantity = Number(quantity);

        if (
            !product ||
            !Number.isSafeInteger(parsedQuantity)
        ) {
            return;
        }

        // Removes the item when its quantity reaches zero or below.
        if (parsedQuantity <= 0) {
            removeFromCart(productId, size, color);
            return;
        }

        // Prevents the requested quantity from exceeding stock.
        if (parsedQuantity > product.stock) return;

        // Updates quantity only in the active account's cart.
        setCartState((current) => {
            if (current.userId !== userId) return current;

            return {
                ...current,
                items: current.items.map((item) =>
                    item.productId === productId &&
                        item.size === size &&
                        item.color === color
                        ? { ...item, quantity: parsedQuantity }
                        : item
                ),
            };
        });
    };

    // Removes a specific product variant from the active cart.
    const removeFromCart = (productId, size, color) => {
        setCartState((current) => {
            if (current.userId !== userId) return current;

            return {
                ...current,
                items: current.items.filter(
                    (item) =>
                        !(
                            item.productId === productId &&
                            item.size === size &&
                            item.color === color
                        )
                ),
            };
        });
    };

    // Clears only the active user's cart.
    const clearCart = () => {
        setCartState((current) => {
            if (current.userId !== userId) return current;

            return {
                ...current,
                items: [],
            };
        });
    };

    // Combines saved cart entries with their product information.
    const cartItems = cart
        .map((item) => {
            const product = products.find(
                (product) => product.id === item.productId
            );

            if (!product) return null;

            return {
                ...product,
                ...item,
                id: product.id,
            };
        })
        .filter(Boolean);

    // Calculates the total quantity of all items in the cart.
    const itemCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // Calculates the subtotal using discounted product prices.
    const subtotal = cartItems.reduce((total, item) => {
        const discountedPrice = Math.round(
            item.price * (1 - (item.discount || 0) / 100)
        );

        return total + discountedPrice * item.quantity;
    }, 0);

    // Calculates the total before applying product discounts.
    const originalTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    // Calculates the total savings from product discounts.
    const totalSavings = originalTotal - subtotal;

    return (
        <CartContext.Provider
            value={{
                cart,
                cartItems,
                itemCount,
                subtotal,
                originalTotal,
                totalSavings,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Provides cart state and actions to consuming components.
export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart must be used inside CartProvider"
        );
    }

    return context;
};
