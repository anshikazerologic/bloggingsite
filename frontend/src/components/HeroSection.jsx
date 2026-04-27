import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/helpers";

export default function HeroSection({ post }) {
  const navigate = useNavigate();

  if (!post) return null;

  const coverImage = post?.coverImage;
  const imageUrl = coverImage?.url?.startsWith("http")
    ? coverImage.url
    : `${import.meta.env.VITE_API_URL}${coverImage?.url || ""}`;

  return (
    <div className="relative mb-16 overflow-hidden rounded-xl">
      <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
        <div className="max-w-3xl">
          <div className="mb-4 inline-block">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
              {post.category?.name || "Featured"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6 text-white">
            <p className="font-semibold text-white">{post.author?.name || "Anonymous"}</p>
            <span className="text-white/80">
              {formatDate(post.publishedAt)}
            </span>
          </div>

          <button
            onClick={() => navigate(`/post/${post.slug}`)}
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Read Story
          </button>
        </div>
      </div>
    </div>
  );
}
