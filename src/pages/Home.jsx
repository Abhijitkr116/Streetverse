import { Link } from "react-router-dom";
import products from "../data/Product";
import ProductCard from "../components/product/ProductCard";

// Defines homepage category cards and their corresponding product filters.
const categories = [
    {
        name: "Men's Wear",
        description: "Everyday essentials for him",
        image: "/products/tshirt-1.jpg",
        filter: "department",
        value: "Men",
        background: "bg-stone-100",
    },
    {
        name: "Women's Wear",
        description: "Modern styles, made for you",
        image: "/products/dress-6.jpg",
        filter: "department",
        value: "Women",
        background: "bg-yellow-50",
    },
    {
        name: "Sneakers",
        description: "Step into everyday comfort",
        image: "/products/sneaker-2.jpg",
        filter: "category",
        value: "Sneakers",
        background: "bg-orange-50",
    },
    {
        name: "Accessories",
        description: "Sunglasses and caps for every look",
        image: "/products/sunglasses-1.jpg",
        filter: "category",
        value: "Accessories",
        background: "bg-zinc-50",
    },
];

// Renders the main hero section with shopping calls to action.
const HeroSection = () => {
    return (
        <section className="relative isolate overflow-hidden rounded-3xl bg-stone-100">
            <div className="grid min-h-[430px] items-center md:grid-cols-2">
                <div className="relative z-10 px-6 py-12 sm:px-10 md:px-12 lg:px-16 lg:py-16">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                        The new collection
                    </span>

                    <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                        Style that feels like you.
                    </h1>

                    <p className="mt-5 max-w-md text-base leading-7 text-gray-600 sm:text-lg">
                        Discover everyday essentials designed for comfort,
                        confidence, and effortless style.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-gray-700"
                        >
                            Shop collection
                            <i className="ri-arrow-right-line" aria-hidden="true" />
                        </Link>

                        <Link
                            to="/products"
                            className="inline-flex items-center rounded-full border border-gray-300 bg-white/70 px-7 py-3.5 text-sm font-medium text-gray-900 transition hover:bg-white"
                        >
                            Explore products
                        </Link>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs text-gray-600 sm:text-sm">
                        <span className="flex items-center gap-2">
                            <i className="ri-check-line text-base" aria-hidden="true" />
                            Quality essentials
                        </span>

                        <span className="flex items-center gap-2">
                            <i className="ri-check-line text-base" aria-hidden="true" />
                            Easy shopping
                        </span>
                    </div>
                </div>

                {/* Displays the hero image with responsive white blending effects. */}
                <div className="relative min-h-[280px] md:absolute md:inset-y-0 md:right-0 md:min-h-0 md:w-1/2">
                    <img
                        src="/products/Jacket-1-3.jpg"
                        alt="Featured jacket from the new collection"
                        className="absolute inset-0 h-full w-full object-cover object-center"
                    />

                    {/* White fade on mobile, horizontal white fade on desktop. */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-transparent md:bg-gradient-to-r md:from-stone-100 md:via-stone-100/20 md:to-transparent" />
                </div>
            </div>
        </section>
    );
};

// Displays the shopping benefits in a responsive row.
const BenefitsSection = () => {
    const benefits = [
        {
            icon: "ri-truck-line",
            title: "Free Shipping",
            description: "On qualifying orders",
        },
        {
            icon: "ri-refresh-line",
            title: "Easy Returns",
            description: "Hassle-free shopping",
        },
        {
            icon: "ri-shield-check-line",
            title: "Secure Shopping",
            description: "Shop with confidence",
        },
        {
            icon: "ri-customer-service-2-line",
            title: "Customer Support",
            description: "We're here to help",
        },
    ];

    return (
        <section className="grid grid-cols-2 gap-5 border-b border-gray-100 py-8 md:grid-cols-4 md:gap-4 md:py-10">
            {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-center gap-3">
                    <i
                        className={`${benefit.icon} text-2xl text-gray-800`}
                        aria-hidden="true"
                    />

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                            {benefit.title}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            {benefit.description}
                        </p>
                    </div>
                </div>
            ))}
        </section>
    );
};

// Renders category cards that link to the correct product filters.
const CategorySection = () => {
    return (
        <section className="py-10 sm:py-14">
            <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Find your style
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
                        Shop by category
                    </h2>
                </div>

                <Link
                    to="/products"
                    className="shrink-0 text-sm font-medium text-gray-700 transition hover:text-black"
                >
                    View all <span aria-hidden="true">→</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        to={`/products?${category.filter}=${encodeURIComponent(category.value)}`}
                        className={`group flex min-h-40 items-center overflow-hidden rounded-2xl ${category.background} transition hover:-translate-y-1 hover:shadow-md`}
                    >
                        <div className="h-40 w-1/2 overflow-hidden sm:w-[48%]">
                            <img
                                src={category.image}
                                alt={category.name}
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                        </div>

                        <div className="flex flex-1 flex-col items-start px-3 py-4 sm:px-4">
                            <h3 className="text-sm font-semibold text-gray-950 sm:text-base">
                                {category.name}
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-gray-600 sm:text-sm">
                                {category.description}
                            </p>

                            <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-900 transition group-hover:bg-gray-950 group-hover:text-white">
                                <i className="ri-arrow-right-line" aria-hidden="true" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};


// Displays a varied selection of products from different categories.
const FeaturedProducts = () => {
    const featuredCategories = [
        "T-Shirts",
        "Jeans",
        "Sneakers",
        "Accessories",
    ];

    // Picks one product from each category, with a fallback if a category is empty.
    const featuredProducts = featuredCategories
        .map((category) =>
            products.find((product) => product.category === category)
        )
        .filter(Boolean);

    return (
        <section className="pb-12 sm:pb-16">
            <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Picked for you
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
                        Featured products
                    </h2>
                </div>

                <Link
                    to="/products"
                    className="shrink-0 text-sm font-medium text-gray-700 transition hover:text-black"
                >
                    View all <span aria-hidden="true">→</span>
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};


// Combines all homepage sections into the main landing page.
const Home = () => {
    return (
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <HeroSection />
            <BenefitsSection />
            <CategorySection />
            <FeaturedProducts />
        </main>
    );
};

export default Home;
