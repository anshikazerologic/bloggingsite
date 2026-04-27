import { useEffect, useState } from "react";
import { fetchPosts } from "../api/api";
import PostCard from "../components/PostCard";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import FeaturedGrid from "../components/FeaturedGrid";

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

  const filteredPosts = posts.filter((post) => {
    const matchCategory = selectedCategory
      ? String(post?.category?.id) === String(selectedCategory)
      : true;

    const matchSearch =
      post?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post?.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  const showHero = !selectedCategory && !searchQuery;
  const heroPost = showHero && posts.length > 0 ? posts[0] : null;

  const remainingPosts = showHero ? posts.slice(1) : filteredPosts;
  const featuredPosts = remainingPosts.slice(0, 6);
  const latestPosts = remainingPosts.slice(6);

  return (
    <div className="min-h-screen bg-white">
      <Header
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onSearch={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <>
            {heroPost && <HeroSection post={heroPost} />}

            {featuredPosts.length > 0 && (
              <FeaturedGrid 
                posts={featuredPosts} 
                title={showHero ? "Featured Stories" : "Stories"}
              />
            )}

            {latestPosts.length > 0 && (
              <section>
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Latest Posts
                  </h2>
                  <div className="w-12 h-1 bg-black rounded-full mt-3" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {latestPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </>
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
      </main>
    </div>
  );
}

export default Home;