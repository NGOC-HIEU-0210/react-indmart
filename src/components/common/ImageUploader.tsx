import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { Button } from '@/components/ui/Button';

export interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  previewUrl?: string | null;
  onClear?: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileSelect,
  previewUrl,
  onClear,
  label = 'Chọn hình ảnh',
  className,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const displayPreview = localPreview || previewUrl;

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh hợp lệ');
      return;
    }
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    onFileSelect(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleClear = () => {
    setLocalPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClear?.();
  };

  return (
    <div className={clsx('w-full', className)}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}

      {displayPreview ? (
        <div className="relative w-36 h-36 rounded-md border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
          <img src={displayPreview} alt="Xem trước" className="w-full h-full object-cover" />
          {!disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1 right-1 rounded-full bg-red-600 text-white w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 transition-colors shadow"
              title="Xoá ảnh"
            >
              ✕
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={clsx(
            'flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            isDragging ? 'border-primary-500 bg-primary-50/50' : 'border-gray-300 hover:border-gray-400 bg-white',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50'
          )}
        >
          <p className="text-sm text-gray-600 font-medium">Kéo thả ảnh vào đây, hoặc click để chọn</p>
          <p className="text-xs text-gray-400 mt-1">Định dạng JPG, PNG, WEBP</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Tải tệp lên
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />
    </div>
  );
};

