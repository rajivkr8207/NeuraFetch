import { useEffect, useState } from "react";
import { deleteItem, getItems } from "../services/item.services";
import SavedItemCard from "../components/SavedItemCar";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState("");
  const fetchItems = async () => {
    try {
      const res = await getItems({
        search,
        type,
        tags
      });
      console.log(res);
      setItems(res.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleTagClick = (tag) => {
    setTags(tag);
  };
  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchItems();
    }, 400); // debounce

    return () => clearTimeout(delayDebounce);
  }, [search, type, tags]);
  if (loading) {
    return <div className="text-center mt-10">Loading items...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100  dark:bg-gray-900 p-6">

      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white ">
        Your Saved Knowledge 📚
      </h1>


      <div className="flex flex-col md:flex-row gap-4 mb-6 text-gray-800 dark:text-white">

        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg w-full"
        />

        {/* 🎯 Type Filter */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="">All</option>
          <option value="image">Image</option>
          <option value="article">Article</option>
          <option value="webpage">Webpage</option>
        </select>

        {/* 🏷️ Tags */}
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="p-2 border rounded-lg"
        />

      </div>
      {items.length === 0 ? (
        <p className="text-gray-500">No items saved yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <SavedItemCard
              key={item._id}
              item={item}
              onDelete={handleDelete}
              onTagClick={handleTagClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}