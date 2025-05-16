'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileIcon, X } from 'lucide-react';
import { toast } from 'sonner';

type FileUploaderProps = {
  value: File[];
  onValueChange: (files: File[]) => void;
  onUpload: (files: File[]) => Promise<void>;
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
};

export function FileUploader({
  value,
  onValueChange,
  onUpload,
  accept,
  maxSize,
  maxFiles
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const maxSizeInMB = maxSize ? maxSize / 1024 / 1024 : 0;

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach((rejection) => {
          toast.error(`File ditolak karena ukuran melebihi ${maxSizeInMB} MB`, {
            richColors: true
          });
        });
        return;
      }

      onValueChange(acceptedFiles);
      setUploading(true);
      onUpload(acceptedFiles).finally(() => setUploading(false));
    },
    [onUpload, onValueChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple: maxFiles !== 1
  });

  const handleRemove = (file: File) => {
    onValueChange(value.filter((f) => f !== file));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`relative rounded-md border p-4 ${
          isDragActive ? 'border-primary-500' : 'border-muted-200'
        } ${uploading ? 'opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className='text-muted-foreground text-center text-sm'>
            Lepaskan file di sini
          </p>
        ) : (
          <p className='text-muted-foreground text-center text-sm'>
            Seret dan lepas file atau klik untuk memilih file
          </p>
        )}
      </div>

      {value.length > 0 && (
        <div className='mt-4'>
          {value.map((file) => (
            <div
              key={file.name}
              className='mt-2 flex items-center justify-between rounded-md border p-2'
            >
              <div className='flex items-center'>
                <FileIcon className='mr-2 h-4 w-4' />
                <span>{file.name}</span>
              </div>
              <button
                onClick={() => handleRemove(file)}
                className='hover:text-red-500'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
