import { Search, Sparkles, Star, Filter } from "lucide-react";
import { categories } from "../data/products";
import ProductCard from "../components/Products/ProductCard";
import Pagination from "../components/Products/Pagination";
import AISearchModal from "../components/Products/AISearchModal";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "../store/slices/productSlice";
import { toggleAIModal } from "../store/slices/popupSlice";

const Products = () => {
  const { products, totalProducts, loading , isAIResult  } = useSelector(
    (state) => state.product
  );

  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const searchTerm = query.get("search");
  const searchedCategory = query.get("category");

  const [searchQuery, setSearchQuery] = useState(searchTerm || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm || "");

  const [selectedCategory, setSelectedCategory] = useState(
    searchedCategory || ""
  );
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const dispatch = useDispatch();

  // ✅ Debounce search (IMPORTANT)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ✅ Fetch products
  useEffect(() => {
    if (isAIResult) return;
    dispatch(
      fetchAllProducts({
        category: selectedCategory,
        price: `${priceRange[0]}-${priceRange[1]}`,
        search: debouncedSearch,
        ratings: selectedRating,
        availability: availability,
        page: currentPage,
      })
    );
  }, [
    dispatch,
    selectedCategory,
    priceRange[0],
    priceRange[1],
    debouncedSearch,
    selectedRating,
    availability,
    currentPage,
    isAIResult,
  ]);

  const totalPages = Math.ceil((totalProducts || 0) / 10);

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* MOBILE FILTER BUTTON */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden mb-4 p-3 glass-card flex items-center space-x-2"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>

          {/* SIDEBAR */}
          <div
            className={`lg:block ${
              isMobileFilterOpen ? "block" : "hidden"
            } w-full lg:w-80 space-y-6`}
          >
            <div className="glass-panel">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Filters
              </h2>

              {/* PRICE */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      priceRange[0],
                      parseInt(e.target.value),
                    ])
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              {/* RATING */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Rating</h3>
                {[4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() =>
                      setSelectedRating(
                        selectedRating === rating ? 0 : rating
                      )
                    }
                    className={`flex items-center space-x-2 w-full p-2 rounded ${
                      selectedRating === rating
                        ? "bg-primary/20"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </button>
                ))}
              </div>

              {/* AVAILABILITY */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Availability</h3>
                {["in-stock", "limited", "out-of-stock"].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setAvailability(
                        availability === status ? "" : status
                      )
                    }
                    className={`w-full p-2 text-left rounded ${
                      availability === status
                        ? "bg-primary/20"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {status === "in-stock"
                      ? "In Stock"
                      : status === "limited"
                      ? "Limited Stock"
                      : "Out of Stock"}
                  </button>
                ))}
              </div>

              {/* CATEGORY */}
              <div>
                <h3 className="text-lg font-medium mb-3">Category</h3>
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`w-full p-2 text-left rounded ${
                    !selectedCategory
                      ? "bg-primary/20"
                      : "hover:bg-secondary"
                  }`}
                >
                  All Categories
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full p-2 text-left rounded ${
                      selectedCategory === category.name
                        ? "bg-primary/20"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN */}
          <div className="flex-1">
            {/* SEARCH */}
            <div className="mb-8 flex gap-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search Products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary border rounded-lg"
                />
              </div>

              <button
                onClick={() => dispatch(toggleAIModal())}
                className="px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                AI Search
              </button>
            </div>

            {/* PRODUCTS */}
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : products.length === 0 ? (
              <p className="text-center">
                No products found matching your criteria.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <AISearchModal />
    </div>
  );
};

export default Products;