// src/components/Profile/TagSuggestions.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiTag,
  FiPlus,
  FiCheck,
  FiTrendingUp
} from "react-icons/fi";

export default function TagSuggestions({ userId }) {
  const [suggestions, setSuggestions] = useState([]);
  const [appliedTags, setAppliedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchTagSuggestions();
  }, [userId]);
  
  const fetchTagSuggestions = async () => {
    setLoading(true);
    try {
      // API call for AI-powered tag suggestions
      const response = await fetch(`/api/users/${userId}/tag-suggestions`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      // Mock data for demo
      setSuggestions([
        { name: "Machine Learning", confidence: 0.92, items: 15, trending: true },
        { name: "Web Development", confidence: 0.88, items: 23, trending: true },
        { name: "Productivity", confidence: 0.85, items: 12, trending: false },
        { name: "Design Patterns", confidence: 0.78, items: 8, trending: true },
        { name: "Data Science", confidence: 0.75, items: 10, trending: false },
        { name: "JavaScript", confidence: 0.72, items: 18, trending: true }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const applyTag = async (tag) => {
    try {
      await fetch(`/api/users/${userId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: tag.name })
      });
      setAppliedTags([...appliedTags, tag.name]);
    } catch (error) {
      console.error("Error applying tag:", error);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
               {/* className="w-5 h-5 text-purple-600 dark:text-purple-400" /> */}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Tag Suggestions
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Based on your saved content
              </p>
            </div>
          </div>
          <button
            onClick={fetchTagSuggestions}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Refresh
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((tag, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FiTag className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      #{tag.name}
                    </span>
                    {tag.trending && (
                      <span className="flex items-center gap-1 text-xs text-green-500">
                        <FiTrendingUp className="w-3 h-3" />
                        Trending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-500">
                      {tag.items} items
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${tag.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round(tag.confidence * 100)}% match
                      </span>
                    </div>
                  </div>
                </div>
                
                {appliedTags.includes(tag.name) ? (
                  <span className="flex items-center gap-1 text-green-500 text-sm">
                    <FiCheck className="w-4 h-4" />
                    Applied
                  </span>
                ) : (
                  <button
                    onClick={() => applyTag(tag)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm"
                  >
                    <FiPlus className="w-4 h-4" />
                    Apply
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}