"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FileIcon, X } from "lucide-react"

type FileUploaderProps = {
  value: File[]
  onValueChange: (files: File[]) => void
  onUpload: (files: File[]) => Promise<void>
  accept?: Record<string, string[]>
  maxSize?: number
  maxFiles?: number
}

export function FileUploader({ value, onValueChange, onUpload, accept, maxSize, maxFiles }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onValueChange(acceptedFiles)
      setUploading(true)
      onUpload(acceptedFiles).finally(() => setUploading(false))
    },
    [onUpload, onValueChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple: maxFiles !== 1,
  })

  const handleRemove = (file: File) => {
    onValueChange(value.filter((f) => f !== file))
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`relative border rounded-md p-4 ${
          isDragActive ? "border-primary-500" : "border-muted-200"
        } ${uploading ? "opacity-50" : ""}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-center text-sm text-muted-foreground">Lepaskan file di sini</p>
        ) : (
          <p className="text-center text-sm text-muted-foreground">Seret dan lepas file atau klik untuk memilih file</p>
        )}
      </div>

      {value.length > 0 && (
        <div className="mt-4">
          {value.map((file) => (
            <div key={file.name} className="flex items-center justify-between border rounded-md p-2 mt-2">
              <div className="flex items-center">
                <FileIcon className="h-4 w-4 mr-2" />
                <span>{file.name}</span>
              </div>
              <button onClick={() => handleRemove(file)} className="hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}