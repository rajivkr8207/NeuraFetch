// src/components/Profile/MemoryResurfacing.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiClock,
  FiCalendar,
  FiBell,
  FiEye,
  FiBookmark
} from "react-icons/fi";

export default function MemoryResurfacing({ userId }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, weekly, monthly
  
  useEffect(() => {
    fetchMemories();
  }, [userId, filter]);
  
  const fetchMemories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/memories?filter=${filter}`);
      const data = await response.json();
      setMemories(data);
    } catch (error) {
      // Mock data
      setMemories([
        {
          id: 1,
          title: "Understanding Machine Learning",
          savedAt: "2024-01-15T10:00:00Z",
          type: "article",
          url: "#",
          notes: "Great introduction to ML concepts",
          tags: ["machine-learning", "ai"],
          timeAgo: "2 months ago",
          resurfaceReason: "You saved this 2 months ago"
        },
        {
          id: 2,
          title: "React Best Practices 2024",
          savedAt: "2024-02-20T15:30:00Z",
          type: "video",
          url: "#",
          notes: "Must watch for React developers",
          tags: ["react", "javascript"],
          timeAgo: "1 month ago",
          resurfaceReason: "Time to review this video"
        },
        {
          id: 3,
          title: "Productivity Tips from Experts",
          savedAt: "2024-01-05T09:15:00Z",
          type: "tweet",
          url: "#",
          notes: "Great thread on productivity",
          tags: ["productivity", "tips"],
          timeAgo: "2.5 months ago",
          resurfaceReason: "You might need this now"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const markAsReviewed = async (id) => {
    try {
      await fetch(`/api/users/${userId}/memories/${id}/review`, {
        method: "POST"
      });
      setMemories(memories.filter(m => m.id !== id));
    } catch (error) {
      console.error("Error marking as reviewed:", error);
    }
  };
  
  const dismissMemory = async (id) => {
    try {
      await fetch(`/api/users/${userId}/memories/${id}/dismiss`, {
        method: "POST"
      });
      setMemories(memories.filter(m => m.id !== id));
    } catch (error) {
      console.error("Error dismissing:", error);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <FiClock className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Memory Resurfacing
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Revisit what you saved in the past
              </p>
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            {["all", "weekly", "monthly"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  filter === f
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                }`}
              >
                {f === "all" ? "All" : f === "weekly" ? "This Week" : "This Month"}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin" />
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-12">
            <FiBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No memories to resurface right now</p>
            <p className="text-sm text-gray-400 mt-1">
              Check back later for old saved items
            </p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {memories.map((memory, index) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative p-5 bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 rounded-xl border border-pink-100 dark:border-pink-800"
                >
                  {/* Time Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 text-xs text-pink-500 bg-pink-100 dark:bg-pink-900/50 px-2 py-1 rounded-full">
                      <FiCalendar className="w-3 h-3" />
                      <span>{memory.timeAgo}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="pr-24">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 bg-white dark:bg-gray-800 rounded-full">
                        {memory.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(memory.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                      {memory.title}
                    </h3>
                    
                    {memory.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-3">
                        "{memory.notes}"
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {memory.tags?.map((tag, idx) => (
                        <span key={idx} className="text-xs text-gray-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-sm text-pink-600 dark:text-pink-400 mb-4">
                      {memory.resurfaceReason}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-3">
                      <a
                        href={memory.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                      >
                        <FiEye className="w-4 h-4" />
                        Review Now
                      </a>
                      <button
                        onClick={() => markAsReviewed(memory.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
                      >
                        <FiBookmark className="w-4 h-4" />
                        Mark Reviewed
                      </button>
                      <button
                        onClick={() => dismissMemory(memory.id)}
                        className="px-3 py-1.5 text-gray-500 hover:text-gray-700 text-sm"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}