'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Album } from './page';

interface AlbumClientProps {
  albums: Album[];
}

export default function AlbumClient({ albums }: AlbumClientProps) {
  const [selectedImage, setSelectedImage] = useState<Album | null>(null);

  const handleImageClick = useCallback((album: Album) => {
    setSelectedImage(album);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  if (albums.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📸</div>
          <p className="text-gray-500 text-lg">相册为空</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-24">
        {/* 标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📸 相册</h1>
          <p className="text-gray-600">共 {albums.length} 张照片</p>
        </motion.div>

        {/* 瀑布流布局 */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {albums.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="break-inside-avoid"
            >
              <div
                onClick={() => handleImageClick(album)}
                className="glass-effect rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={album.imageUrl}
                    alt={album.description}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                <div className="p-4">
                  <p className="text-gray-700 text-sm">{album.description}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    {new Date(album.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 图片预览模态框 */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <button
                onClick={handleCloseModal}
                className="absolute -top-12 right-0 text-white text-4xl hover:text-pink-400 transition-colors"
              >
                ×
              </button>
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.description}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="mt-4 p-4 bg-white/90 backdrop-blur-sm rounded-lg">
                <p className="text-gray-800 font-medium">{selectedImage.description}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(selectedImage.createdAt).toLocaleString('zh-CN')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
