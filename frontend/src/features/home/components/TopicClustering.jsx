// src/components/Profile/TopicClustering.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiPieChart,
  FiPackage,
  FiTrendingUp,
  FiMoreHorizontal
} from "react-icons/fi";

export default function TopicClustering({ userId }) {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchTopicClusters();
  }, [userId]);
  
  const fetchTopicClusters = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/topics`);
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      // Mock data
      setTopics([
        {
          id: 1,
          name: "Artificial Intelligence",
          size: 24,
          color: "#3B82F6",
          growth: "+15%",
          items: [
            { title: "Understanding Neural Networks", date: "2024-01-15" },
            { title: "GPT-4 Technical Report", date: "2024-01-20" },
            { title: "AI Ethics Guidelines", date: "2024-02-01" }
          ]
        },
        {
          id: 2,
          name: "Web Development",
          size: 18,
          color: "#10B981",
          growth: "+8%",
          items: [
            { title: "React 19 Features", date: "2024-01-10" },
            { title: "Tailwind CSS Best Practices", date: "2024-01-25" }
          ]
        },
        {
          id: 3,
          name: "Productivity",
          size: 12,
          color: "#F59E0B",
          growth: "+22%",
          items: [
            { title: "Getting Things Done", date: "2024-02-05" },
            { title: "Time Management Techniques", date: "2024-02-10" }
          ]
        },
        {
          id: 4,
          name: "Data Science",
          size: 10,
          color: "#EF4444",
          growth: "+5%",
          items: [
            { title: "Python for Data Analysis", date: "2024-01-05" }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <FiPackage className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Topic Clusters
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI-powered topic grouping
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Topic Visualization */}
            <div className="flex flex-wrap gap-3 mb-6">
              {topics.map((topic) => (
                <motion.button
                  key={topic.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTopic(topic.id === selectedTopic ? null : topic.id)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedTopic === topic.id
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: topic.color }}
                    />
                    <span className="text-sm font-medium">{topic.name}</span>
                    <span className="text-xs opacity-75">({topic.size})</span>
                    {topic.growth && (
                      <span className="text-xs text-green-500">{topic.growth}</span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
            
            {/* Topic Details */}
            {selectedTopic && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {topics.find(t => t.id === selectedTopic)?.name} - Recent Items
                </h3>
                <div className="space-y-2">
                  {topics
                    .find(t => t.id === selectedTopic)
                    ?.items.slice(0, 3)
                    .map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          {item.title}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}