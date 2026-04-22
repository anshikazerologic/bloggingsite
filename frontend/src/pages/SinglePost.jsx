import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostBySlug, getCategoryColor } from "../api/api";
import { formatDate } from "../utils/helpers";

function SinglePost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        const data = await fetchPostBySlug(slug);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-10 h-10 mx-auto mb-3">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900"></div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-sm font-medium mb-4">Post not found.</p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  const author = post.author;
  const coverImage = post.coverImage;
  const categoryColor = post.category ? getCategoryColor(post.category.id) : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      {/* Back Button */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium rounded-md hover:bg-gray-100 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-6">
      
        {coverImage && (
          <div className="mb-6 rounded-lg overflow-hidden shadow-md border border-gray-100">
            <img
              src={
              coverImage?.url?.startsWith("http")
                ? coverImage.url
                : `${import.meta.env.VITE_API_URL}${coverImage.url}`
            }
              alt={post.title}
              className="w-full h-48 md:h-64 object-cover"
            />
            
          </div>
        )}

       
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

       
        <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-gray-200">
        
          <div className="flex items-center gap-2">
            
            <div>
              <p className="text-sm font-semibold text-gray-900">{author?.name}</p>
              <p className="text-xs text-gray-500">
                {formatDate(post.publishedAt)}
              </p>
            </div>
          </div>

         
          {post.category && categoryColor && (
            <div
              className="px-3 py-1 rounded-full text-white font-semibold text-xs ml-auto"
              style={{ backgroundColor: categoryColor.bg }}
            >
              {post.category.name}
            </div>
          )}
        </div>

     
        <div className="prose max-w-none mb-8">
          {post.content?.map((block, index) => (
            <div key={index} className="mb-4">
              {block.type === 'paragraph' && (
                <p className="text-gray-700 leading-relaxed text-base">
                  {block.children?.map((child, childIndex) => (
                    <span
                      key={childIndex}
                      className={`${child.bold ? 'font-bold text-gray-900' : ''} ${child.italic ? 'italic' : ''}`}
                    >
                      {child.text}
                    </span>
                  ))}
                </p>
              )}
              {block.type === 'heading' && (
                <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3">
                  {block.children?.map((child) => child.text).join('')}
                </h2>
              )}
            </div>
          ))}
        </div>

       
        {post.tags && post.tags.length > 0 && (
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-2 bg-linear-to-r from-gray-900 to-gray-800 text-white text-sm font-semibold rounded-md hover:from-gray-800 hover:to-gray-700 transition-all shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Posts
          </button>
        </div>
      </article>
    </div>
  );
}

export default SinglePost;