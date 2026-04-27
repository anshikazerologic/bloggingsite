import { useEffect, useState } from "react";
import { fetchPosts } from "../api/api";
import PostCard from "../components/PostCard";
import Header from "../components/Header";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchPosts();
      setPosts(data);
      setLoading(false);
    };

    load();
  }, []);

  // Filter posts based on category and search query
  const filteredPosts = posts.filter((post) => {
    const matchCategory = selectedCategory
      ? String(post?.category?.id) === String(selectedCategory)
      : true;

    const matchSearch =
      post?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post?.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Categories and Search */}
      <Header
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onSearch={setSearchQuery}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 text-lg font-medium">
              No posts found
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;