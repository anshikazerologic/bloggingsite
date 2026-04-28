export default function RichTextRenderer({ content }) {
  if (!content) return null;

  
  const renderChildren = (children = []) =>
    children.map((child, i) => {
      if (!child) return null;

    
      if (child.type === "link") {
        return (
          <a
            key={i}
            href={child.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            {renderChildren(child.children || [])}
          </a>
        );
      }

      if (child.type === "text") {
        let text = child.text;
        if (!text) return null;

        if (child.bold) text = <strong>{text}</strong>;
        if (child.italic) text = <em>{text}</em>;
        if (child.underline) text = <u>{text}</u>;
        if (child.strikethrough) text = <s>{text}</s>;

        return <span key={i}>{text}</span>;
      }

     
      if (child.children) {
        return (
          <span key={i}>
            {renderChildren(child.children)}
          </span>
        );
      }

      return null;
    });

  return (
    <div className="prose prose-lg max-w-none mb-16">
      {content.map((block, i) => {
        if (!block) return null;

       
        const isEmptyParagraph =
          block.type === "paragraph" &&
          block.children?.every(
            (c) => !c.text || c.text.trim() === ""
          );

        if (isEmptyParagraph) return null;

        switch (block.type) {
         
          case "heading": {
            const Tag = `h${block.level || 2}`;

            return (
              <Tag
                key={i}
                className="mt-8 mb-4 font-bold text-gray-900"
              >
                {renderChildren(block.children)}
              </Tag>
            );
          }

        
          case "paragraph":
            return (
              <p
                key={i}
                className="text-gray-800 text-lg leading-relaxed mb-6"
              >
                {renderChildren(block.children)}
              </p>
            );

          
          case "list": {
            const isOrdered = block.format === "ordered";
            const ListTag = isOrdered ? "ol" : "ul";

            return (
              <ListTag
                key={i}
                className={`ml-6 mb-6 ${
                  isOrdered ? "list-decimal" : "list-disc"
                }`}
              >
                {block.children?.map((item, j) => {
                  if (!item) return null;

                  
                  let content = [];

                  if (item.children?.[0]?.type === "text") {
                    content = item.children;
                  } else if (item.children?.[0]?.children) {
                    content = item.children[0].children;
                  }

                  const isEmptyItem = content.every(
                    (c) => !c.text || c.text.trim() === ""
                  );

                  if (isEmptyItem) return null;

                  return (
                    <li
                      key={j}
                      className="mb-2 text-gray-800 text-lg"
                    >
                      {renderChildren(content)}
                    </li>
                  );
                })}
              </ListTag>
            );
          }

       
          case "image": {
            const src = block.image?.url?.startsWith("http")
              ? block.image.url
              : `${import.meta.env.VITE_API_URL}${block.image?.url}`;

            if (!src) return null;

            return (
              <div key={i} className="my-10">
                <img
                  src={src}
                  alt={block.image?.alternativeText || "image"}
                  className="w-full rounded-lg"
                />

                {block.image?.caption && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    {block.image.caption}
                  </p>
                )}
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}