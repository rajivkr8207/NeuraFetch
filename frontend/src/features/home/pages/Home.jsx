import { useEffect, useState } from "react";
import { deleteItem, getItems } from "../services/item.services";
import SavedItemCard from "../components/SavedItemCar";
import TagSuggestions from "../components/TagSuggestions";
import TopicClustering from "../components/TopicClustering";
import KnowledgeGraph from "../components/KnowledgeGraph";
import RelatedItems from "../components/RelatedItems";
import MemoryResurfacing from "../components/MemoryResurfacing";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { RiChatVoiceAiLine } from "react-icons/ri";
import ChatApp from "../components/ChatApp";
export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState("");
  const [chatbot, setChatbot] = useState(false)
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
    <div className="min-h-screen  bg-gray-100  dark:bg-gray-900 p-6">
      {chatbot &&
        <ChatApp setChatbot={setChatbot} />
      }
      <div  className="z-20 fixed bottom-12 right-8 rounded-full">
        <button onClick={()=>setChatbot(!chatbot)} className="p-3 rounded-full bg-purple-600 text-4xl">
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
          className="p-2 border rounded-lg"
        >
          <option value="">All</option>
          <option value="image">Image</option>
          <option value="article">Article</option>
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
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TagSuggestions userId={userId} />

        <TopicClustering userId={userId} />

        <KnowledgeGraph userId={userId} />

        <RelatedItems userId={userId} />
      </div> */}

      {/* <div className="mt-8">
        <MemoryResurfacing userId={userId} />
      </div> */}
      {items.length === 0 ? (
        <p className="text-gray-500">No items saved yet.</p>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {items.map((item) => (
            <div key={item._id} className="break-inside-avoid">
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