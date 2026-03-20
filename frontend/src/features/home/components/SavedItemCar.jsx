// src/components/SavedItemCard.jsx

export default function SavedItemCard({ item, onDelete, onTagClick }) {
  console.log(item);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col gap-3">

      {item.type === "image" && (
        <img
          src={item.url}
          alt={item.title}
          className="w-full h-40 object-cover rounded-lg"
        />
      )}

      <h3 className="font-semibold text-lg text-gray-800 dark:text-white line-clamp-2">
        {item.title || item?.metadata?.pageTitle || "Untitled"}
      </h3>

      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-500 text-sm truncate"
      >
        {item.url}
      </a>

      {item.notes && (
        <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
          {item.notes}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {item.tags?.map((tag, index) => (

          <span
            key={index}
            onClick={() => onTagClick(tag)}
            className="cursor-pointer text-xs bg-gray-200 px-2 py-1 rounded"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-2">

        <span className="text-xs text-gray-400">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>

        <button
          onClick={() => onDelete(item._id)}
          className="text-red-500 text-sm hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}