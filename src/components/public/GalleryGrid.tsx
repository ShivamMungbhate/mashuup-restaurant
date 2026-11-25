'use client';

import React, { useState } from 'react';
import { GalleryImage } from '@/types';
import { Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface GalleryGridProps {
  images: GalleryImage[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="bg-green-50 p-12 rounded-3xl text-center border border-green-100 max-w-md mx-auto">
        <ImageIcon className="w-12 h-12 text-green-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-green-900 mb-2">No Gallery Photos Yet</h3>
        <p className="text-xs text-gray-500">
          The owner has not uploaded any gallery photos yet. Check back soon!
        </p>
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null)
      setActiveIdx(activeIdx === 0 ? images.length - 1 : activeIdx - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null)
      setActiveIdx(activeIdx === images.length - 1 ? 0 : activeIdx + 1);
  };

  return (
    <div>
      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <div
            key={img.id}
            onClick={() => setActiveIdx(idx)}
            className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer border border-green-100 hover:border-green-300 hover:shadow-2xl hover:shadow-green-800/10 hover:-translate-y-1 transition-all duration-500 bg-green-50"
          >
            <img
              src={img.imageUrl}
              alt={img.caption || 'Mashuup restaurant photo'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 via-green-900/10 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-300" />

            {/* Expand Icon */}
            <div className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 border border-green-200 text-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
              <Maximize2 className="w-4 h-4" />
            </div>

            {/* Caption */}
            {img.caption && (
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs font-semibold text-white group-hover:text-green-200 transition-colors line-clamp-2">
                  {img.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeIdx !== null && (
        <div
          onClick={() => setActiveIdx(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          {/* Close */}
          <button
            onClick={() => setActiveIdx(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-green-600 transition z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          <button
            onClick={handlePrev}
            className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-green-600 transition z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next */}
          <button
            onClick={handleNext}
            className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-green-600 transition z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center space-y-4"
          >
            <img
              src={images[activeIdx].imageUrl}
              alt={images[activeIdx].caption || 'Gallery photo'}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
            />
            {images[activeIdx].caption && (
              <p className="text-sm font-medium text-green-200 text-center max-w-lg">
                {images[activeIdx].caption}
              </p>
            )}
            <span className="text-xs text-gray-400">
              {activeIdx + 1} of {images.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
