import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostBySlug, fetchPosts } from "../api/api";
import { formatDate } from "../utils/helpers";
import { ArrowLeft, ArrowUp } from "lucide-react";
import PostCard from "../components/PostCard";
import RichTextRenderer from "../components/RichTextRenderer";

export default function SinglePost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [seconds, setSeconds] = useState(0);

  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isBottom, setIsBottom] = useState(false);

  const storageKey = `read_time_${slug}`;


  useEffect(() => {
    const load = async () => {
      setLoading(true);
      window.scrollTo(0, 0);

      const postData = await fetchPostBySlug(slug);
      setPost(postData);

      const postsData = await fetchPosts();
      setAllPosts(postsData);

      const savedTime = localStorage.getItem(storageKey);
      setSeconds(savedTime ? parseInt(savedTime) : 0);

      setLoading(false);
    };

    load();
  }, [slug]);


  useEffect(() => {
    if (!post) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        const updated = prev + 1;
        localStorage.setItem(storageKey, updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [post]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      const atBottom = scrollTop + windowHeight >= docHeight - 10;

      setIsBottom(atBottom);
      setShowTopBtn(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatTime = (sec) =>
    `${Math.max(1, Math.floor(sec / 60))} min read`;

  const coverImage = post?.coverImage?.url?.startsWith("http")
    ? post.coverImage.url
    : `${import.meta.env.VITE_API_URL}${post?.coverImage?.url || ""}`;

  const avatar = post?.author?.avatar?.url?.startsWith("http")
    ? post.author.avatar.url
    : `${import.meta.env.VITE_API_URL}${post?.author?.avatar?.url || ""}`;

  const relatedPosts = allPosts.filter(
    (p) =>
      p.category?.id === post?.category?.id &&
      p.slug !== post.slug
  );
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <article className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">


        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-12 text-gray-600 hover:text-black transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>


        <header className="mb-12">

          <div className="mb-4">
            <span className="inline-block bg-black text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
              {post.category?.name || "Article"}
            </span>
          </div>


          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>


          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              {avatar && (
                <img
                  src={avatar}
                  className="w-12 h-12 rounded-full object-cover"
                  alt="author"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900">
                  {post.author?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(post.publishedAt)}
                </p>
              </div>
            </div>
            <span className="text-gray-600 font-semibold md:ml-auto">
              {formatTime(seconds)}
            </span>
          </div>
        </header>


        {coverImage && (
          <div className="mb-12 rounded-xl overflow-hidden h-64 md:h-105">
            <img
              src={coverImage}
              className="w-full h-full object-cover"
              alt="cover"
            />
          </div>
        )}

        <RichTextRenderer content={post.content} />

        <div className="border-t border-gray-200 my-12" />


        <div className="mb-16 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-4">
            {avatar && (
              <img
                src={avatar}
                className="w-16 h-16 rounded-full object-cover shrink-0"
                alt="author"
              />
            )}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                About {post.author?.name}
              </h3>
              <p className="text-gray-600 text-sm">
                Writer and content creator sharing thoughts on technology, design, and life.
              </p>
            </div>
          </div>
        </div>


        {relatedPosts.length > 0 && (
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                More from {post.category?.name}
              </h2>
              <p className="text-gray-600">
                Continue exploring related articles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 6).map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </article>


      {showTopBtn && !isBottom && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg hover:scale-105 transition"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {isBottom && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
          <button
            onClick={scrollToTop}
            className="bg-black text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition flex items-center gap-2"
          >
            <ArrowUp size={18} />
            Back to Top
          </button>
        </div>
      )}
    </div>
  );
}