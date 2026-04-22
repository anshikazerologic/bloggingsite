import { useEffect, useState } from "react";
import { fetchCategories, getCategoryColor } from "../api/api";

function CategoryFilter({ onSelect, selectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.log("Error loading categories", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="mb-8 bg-white rounded-lg shadow-md p-4 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Filter by Category
      </h3>

    
      {loading && (
        <div className="flex items-center justify-center space-x-2 py-3">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-900"></div>
          <p className="text-xs text-gray-600 font-medium">Loading...</p>
        </div>
      )}

   
      {!loading && (
        <div className="flex flex-wrap gap-2">
        
          <button
            onClick={() => onSelect(null)}
            className={`px-4 py-2 rounded-md font-semibold text-xs transition-all duration-200 border flex items-center gap-1 ${
              !selectedCategory
                ? "bg-gray-900 text-white border-gray-900 shadow-sm hover:shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            </svg>
            All
          </button>

          {categories.map((category) => {
            const color = getCategoryColor(category.id);
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onSelect(category.id)}
                className={`px-4 py-2 rounded-md font-semibold text-xs transition-all duration-200 border flex items-center gap-1 ${
                  isSelected
                    ? "text-white border shadow-sm hover:shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                style={isSelected ? { backgroundColor: color.bg, borderColor: color.bg } : {}}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color.bg }}
                ></span>
                {category.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CategoryFilter;