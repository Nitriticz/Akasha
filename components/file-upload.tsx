"use client";

import { storage } from "@/app/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { X } from "lucide-react";
import Image from "next/image";
import { v4 } from "uuid";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
}

export const FIleUpload = ({ onChange, value }: FileUploadProps) => {
  if (value) {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-full"
          style={{ objectFit: "cover" }}
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={async (e) => {
            e.target.files && onChange(await uploadFile(e.target.files[0]));
          }}
        />
      </label>
    </div>
  );
};

async function uploadFile(file: File) {
  if (file) {
    if (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(file.name)) {
      const storageRef = ref(storage, "spaces/" + v4());
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    }
  }
  return undefined;
}
