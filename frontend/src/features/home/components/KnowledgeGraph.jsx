// src/components/Profile/KnowledgeGraph.jsx
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  FiShare2,
  FiZoomIn,
  FiZoomOut,
  FiMove
} from "react-icons/fi";

export default function KnowledgeGraph({ userId }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    fetchGraphData();
  }, [userId]);
  
  const fetchGraphData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/knowledge-graph`);
      const data = await response.json();
      setNodes(data.nodes);
      setEdges(data.edges);
    } catch (error) {
      // Mock data
      setNodes([
        { id: 1, label: "React", type: "technology", size: 30, color: "#3B82F6" },
        { id: 2, label: "JavaScript", type: "language", size: 25, color: "#F59E0B" },
        { id: 3, label: "TypeScript", type: "language", size: 20, color: "#10B981" },
        { id: 4, label: "Web Dev", type: "topic", size: 35, color: "#EF4444" },
        { id: 5, label: "Next.js", type: "framework", size: 28, color: "#8B5CF6" },
        { id: 6, label: "Tailwind", type: "css", size: 22, color: "#06B6D4" }
      ]);
      setEdges([
        { source: 1, target: 2, strength: 0.9 },
        { source: 1, target: 3, strength: 0.8 },
        { source: 1, target: 4, strength: 0.7 },
        { source: 5, target: 1, strength: 0.6 },
        { source: 6, target: 1, strength: 0.5 }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  // Simple D3.js or canvas visualization would go here
  // For demo, showing a placeholder
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiShare2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Knowledge Graph
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Visualize connections between topics
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <FiZoomIn className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <FiZoomOut className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <FiMove className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="relative min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl overflow-hidden">
            {/* Graph Visualization Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {nodes.slice(0, 8).map((node) => (
                    <div
                      key={node.id}
                      className="px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                      style={{
                        backgroundColor: node.color + "20",
                        color: node.color,
                        border: `1px solid ${node.color}`
                      }}
                    >
                      {node.label}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  {nodes.length} nodes • {edges.length} connections
                </p>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition">
                  Explore Full Graph
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}