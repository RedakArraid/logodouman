'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  placeholder?: string;
  accept?: string;
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  placeholder = "Choisir une image",
  accept = "image/*"
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentImage || '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreview('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Zone de prévisualisation */}
      {preview && (
        <div className="relative">
          <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={preview}
              alt="Prévisualisation"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            type="button"
          >
            ×
          </button>
        </div>
      )}

      {/* Zone d'upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
        }`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl text-gray-400">📸</div>
          <p className="text-sm font-medium text-gray-700">
            {placeholder}
          </p>
          <p className="text-xs text-gray-500">
            Glissez-déposez ou cliquez pour choisir
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG, SVG jusqu'à 10MB
          </p>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-2">
        <button
          onClick={handleClick}
          type="button"
          className="flex-1 bg-orange-100 text-orange-700 py-2 px-4 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
        >
          📁 Parcourir
        </button>
        {preview && (
          <button
            onClick={removeImage}
            type="button"
            className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            🗑️ Supprimer
          </button>
        )}
      </div>
    </div>
  );
}