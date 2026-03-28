import { useEffect, useState } from "react";
import SavedItemCard from "../components/SavedItemCar";
import { RiChatVoiceAiLine } from "react-icons/ri";
import ChatApp from "../components/ChatApp";
import useItem from "../hooks/useItem";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState("");
  const [chatbot, setChatbot] = useState(false)
  const { fetchItems, handleDelete } = useItem()
  const { loading, items } = useSelector(state => state.items)

  const handleTagClick = (tag) => {
    setTags(tag);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchItems(search, type, tags);
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [search, type, tags]);



  return (
    <div className="min-h-screen  bg-gray-100  dark:bg-gray-900 p-6">
      {chatbot &&
        <ChatApp setChatbot={setChatbot} />
      }
      <div className="z-20 fixed bottom-12 right-8 rounded-full">
        <button onClick={() => setChatbot(!chatbot)} className="p-3 rounded-full bg-purple-600 text-4xl">
          <RiChatVoiceAiLine />
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white ">
        Your Saved Knowledge 📚
      </h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6 text-gray-800 dark:text-white">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg w-full"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border rounded-lg bg-neutral-950"
        >
          <option value="">All</option>
          <option value="image">Image</option>
          <option value="article">Article</option>
          <option value="video">Video</option>
          <option value="webpage">Webpage</option>
        </select>

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="p-2 border rounded-lg"
        />

      </div>

      <button onClick={() => fetchItems(search, type, tags)} className="bg-purple-600 px-4 py-2 rounded-lg my-4">
        Refresh
      </button>
      {loading &&
        <div className="text-center mt-10">Loading items...</div>
      }

      {items?.length === 0 ? (
        <p className="text-gray-500">No items saved yet.</p>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {items?.map((item) => (
            <div key={item?._id} className="break-inside-avoid">
              <SavedItemCard
                item={item}
                onDelete={handleDelete}
                onTagClick={handleTagClick}
              />
            </div>
          ))}
        </div>
      )
      }
    </div >
  );
}