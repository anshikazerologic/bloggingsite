import PostCard from "./PostCard";

export default function FeaturedGrid({ posts, title = "Featured Stories" }) {
  if (!posts || posts.length === 0) return null;


  const featuredPosts = posts.slice(0, 6);

  return (
    <section className="mb-16">
      
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          {title}
        </h2>
        <div className="w-12 h-1 bg-black rounded-full mt-3" />
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
