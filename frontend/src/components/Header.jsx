import { useEffect, useState, useRef } from "react";
import { fetchCategories } from "../api/api";
import { Search, Menu } from "lucide-react";

export default function Header({
  selectedCategory,
  onSelectCategory,
  onSearch,
}) {
  const [categories, setCategories] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data || []);
    };
    loadCategories();
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => {
      const next = !prev;

      if (!prev) {
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        setSearchQuery("");
        onSearch("");
      }

      return next;
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">

      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4">

     
        <div className="md:hidden pt-2">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu />
          </button>
        </div>

      
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 overflow-x-auto no-scrollbar flex-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`text-sm font-semibold whitespace-nowrap ${
              selectedCategory === null
                ? "text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`text-sm font-semibold whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>

       
        <div className="flex items-center ml-auto">

          <div className="relative flex items-center">

            <div
              className={`relative flex items-center transition-all duration-300 ease-out
                ${isSearchOpen ? "w-70" : "w-10"}
              `}
            >

            
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search..."
                className={`w-full bg-gray-50 border border-gray-200 rounded-full text-sm
                focus:outline-none transition-all duration-300
                ${
                  isSearchOpen
                    ? "pl-10 pr-10 py-2 opacity-100"
                    : "pl-0 pr-0 py-2 opacity-0 pointer-events-none"
                }`}
              />

              <button
                onClick={toggleSearch}
                className="absolute left-0 w-10 h-10 flex items-center justify-center text-black"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>

       

      </div>

   
      {isMenuOpen && (
        <div className="md:hidden border-t px-4 py-3 space-y-2 bg-white">
          <button
            onClick={() => {
              onSelectCategory(null);
              setIsMenuOpen(false);
            }}
            className="block w-full text-left"
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left"
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}