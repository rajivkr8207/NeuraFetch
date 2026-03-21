// src/components/SavedItemCard.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FiExternalLink,
  FiTrash2,
  FiTag,
  FiCalendar,
  FiEye,
  FiFileText,
  FiImage,
  FiYoutube,
  FiTwitter,
  FiLink,
  FiBookmark,
  FiClock,
  FiDownload
} from "react-icons/fi";
import { FaRegClock, FaLink } from "react-icons/fa";

const itemTypeConfig = {
  image: {
    icon: FiImage,
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    textColor: "text-purple-600 dark:text-purple-400",
    label: "Image"
  },
  video: {
    icon: FiYoutube,
    bgColor: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-600 dark:text-red-400",
    label: "Video"
  },
  tweet: {
    icon: FiTwitter,
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-500 dark:text-blue-400",
    label: "Tweet"
  },
  article: {
    icon: FiFileText,
    bgColor: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-600 dark:text-green-400",
    label: "Article"
  },
  webpage: {
    icon: FiLink,
    bgColor: "bg-gray-100 dark:bg-gray-700",
    textColor: "text-gray-600 dark:text-gray-400",
    label: "Webpage"
  },
  pdf: {
    icon: FiFileText,
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-600 dark:text-orange-400",
    label: "PDF"
  },
  note: {
    icon: FiBookmark,
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-600 dark:text-yellow-400",
    label: "Note"
  }
};

export default function SavedItemCard({ item, onDelete, onTagClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const type = item.type || item.contentType || "webpage";
  const TypeIcon = itemTypeConfig[type]?.icon || FiLink;
  const typeConfig = itemTypeConfig[type] || itemTypeConfig.webpage;

  const title = item.title || item.metadata?.pageTitle || "Untitled";
  const url = item.url || item.metadata?.url || "#";
  const domain = url !== "#" ? new URL(url).hostname : "";
  const savedDate = new Date(item.savedAt || item.createdAt);
  const isYouTube = url.includes("youtube.com/watch") || url.includes("youtu.be");
  // const isTwitter = url.includes("twitter.com") || url.includes("x.com");

  // YouTube video ID extraction
  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
    return match ? match[1] : null;
  };

  const youtubeId = isYouTube ? getYouTubeId(url) : null;
  const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null;
const handleDownload = async () => {
  if (!url) return;
  
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = getFileNameFromUrl(url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: open in new tab
    window.open(url, '_blank');
  }
};

// Helper function to extract filename from URL
const getFileNameFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop();
    return filename || 'download';
  } catch {
    return 'download';
  }
};
  // Determine what to show in media section
  const showMedia = () => {
    if (type === "image" && !imageError) {
      return (
        <div className="relative w-full h-48 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}
          <img
            src={item.url}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
              } ${isHovered ? "scale-110" : ""}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
            >
              <button
                onClick={() => window.open(url, "_blank")}
                className="p-2 bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition"
              >
                <FiEye className="w-5 h-5 text-white" />
              </button>
              <button

                className="p-2 bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition"
                onClick={handleDownload}
              >
                <FiDownload className="w-5 h-5 text-white" />
              </button>
            </motion.div>
          )}
        </div>
      );
    }

    if (type === "video" && youtubeId) {
      return (
        <div className="relative w-full h-48 overflow-hidden rounded-xl bg-gray-900">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(url, "_blank")}
              className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition"
            >
              <FiYoutube className="w-8 h-8 text-white" />
            </motion.button>
          </div>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-2 right-2"
            >
              <span className="px-2 py-1 bg-black/70 text-white text-xs rounded">
                Watch on YouTube
              </span>
            </motion.div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group pt-12 relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      {/* Type Badge - Top Left */}
      <div className="absolute top-3 left-3 z-10">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ${typeConfig.bgColor} backdrop-blur-sm shadow-sm`}
        >
          <TypeIcon className={`w-3.5 h-3.5 ${typeConfig.textColor}`} />
          <span className={`text-xs font-medium ${typeConfig.textColor}`}>
            {typeConfig.label}
          </span>
        </motion.div>
      </div>

      {/* Visit URL Button - Top Right */}
      <motion.a
        href={url}
        target="_blank"
        rel="noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
      >
        <FiExternalLink className="w-3.5 h-3.5 text-blue-500" />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
          {domain || "Visit"}
        </span>
      </motion.a>

      {/* Media Section */}
      {showMedia()}

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        {/* URL */}
        <div className="flex items-center gap-2">
          <FaLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 truncate transition"
          >
            {url}
          </a>
        </div>

        {/* Notes */}
        {item.notes && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg italic"
          >
            "{item.notes}"
          </motion.p>
        )}

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <FiTag className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
            {item.tags.map((tag, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTagClick?.(tag)}
                className="cursor-pointer text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2.5 py-1 rounded-full transition-colors"
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        )}

        {/* Footer with Date and Actions */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FiCalendar className="w-3.5 h-3.5" />
            <span>{savedDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}</span>
            <span>•</span>
            <FaRegClock className="w-3 h-3" />
            <span>{savedDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete?.(item._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Delete</span>
          </motion.button>
        </div>
      </div>

      {/* Hover Border Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)",
        }}
      />
    </motion.div>
  );
}