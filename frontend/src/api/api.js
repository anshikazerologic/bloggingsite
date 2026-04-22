const API_URL = import.meta.env.VITE_API_URL;

export const fetchPosts = async (categoryId = null) => {
  let url = `${API_URL}/api/posts?populate[0]=author&populate[1]=category&populate[2]=coverImage&populate[3]=tags`;

  if (categoryId) {
    url += `&filters[category][id][$eq]=${categoryId}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  return data.data;
};


export const fetchPostBySlug = async (slug) => {
  const res = await fetch(
    `${API_URL}/api/posts?filters[slug][$eq]=${slug}&populate[0]=author&populate[1]=category&populate[2]=coverImage&populate[3]=tags`
  );

  const data = await res.json();
  return data.data[0];
};




export const fetchCategories = async () => {
  const res = await fetch(`${API_URL}/api/categories`);
  const data = await res.json();
  return data.data;
};


export const getCategoryColor = (categoryId) => {
  const colors = [
    { bg: '#DC2626', text: '#FEE2E2', dark: '#991B1B' },      // Red
    { bg: '#2563EB', text: '#DBEAFE', dark: '#1E40AF' },      // Blue
    { bg: '#7C3AED', text: '#EDE9FE', dark: '#5B21B6' },      // Purple
    { bg: '#059669', text: '#DCFCE7', dark: '#065F46' },      // Green
    { bg: '#DB2777', text: '#FCE7F3', dark: '#831843' },      // Pink
    { bg: '#EA580C', text: '#FFEDD5', dark: '#7C2D12' },      // Orange
    { bg: '#0369A1', text: '#CFF0F9', dark: '#003D82' },      // Cyan
    { bg: '#4F46E5', text: '#E0E7FF', dark: '#3730A3' },      // Indigo
  ];
  return colors[categoryId % colors.length];
};