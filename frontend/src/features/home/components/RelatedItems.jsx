// src/components/Profile/RelatedItems.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiLink,
  FiThumbsUp,
  FiExternalLink
} from "react-icons/fi";

export default function RelatedItems({ userId }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  
  useEffect(() => {
    fetchRelatedItems();
  }, [userId]);
  
  const fetchRelatedItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/related-items`);
      const data = await response.json();
      setRelated(data);
    } catch (error) {
      // Mock data
      setRelated([
        {
          id: 1,
          title: "Understanding React Hooks",
          similarity: 0.92,
          type: "article",
          url: "#",
          tags: ["react", "hooks", "javascript"]
        },
        {
          id: 2,
          title: "Advanced React Patterns",
          similarity: 0.88,
          type: "video",
          url: "#",
          tags: ["react", "patterns", "advanced"]
        },
        {
          id: 3,
          title: "React Performance Optimization",
          similarity: 0.85,
          type: "article",
          url: "#",
          tags: ["react", "performance", "optimization"]
        },
        {
          id: 4,
          title: "TypeScript with React",
          similarity: 0.79,
          type: "tweet",
          url: "#",
          tags: ["typescript", "react", "typing"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <FiLink className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Related Items
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Discover content similar to your saved items
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {related.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                onClick={() => setSelectedItem(item.id === selectedItem ? null : item.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                        {item.type}
                      </span>
                      <span className="text-xs text-green-500">
                        {Math.round(item.similarity * 100)}% similar
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-500 transition">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags?.map((tag, idx) => (
                        <span key={idx} className="text-xs text-gray-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    {selectedItem === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600"
                      >
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600"
                        >
                          <FiExternalLink className="w-4 h-4" />
                          Visit related content
                        </a>
                      </motion.div>
                    )}
                  </div>
                  
                  <button className="opacity-0 group-hover:opacity-100 transition">
                    <FiThumbsUp className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}