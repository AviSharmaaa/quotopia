"use client";
import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { MdLogout } from "react-icons/md";
import quotesService from "../services/quotes";
import { toast } from "../components/ui/use-toast";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import authService from "../services/auth";

export default function Upload() {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [canUpload, setCanUpload] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [quote, setQuote] = useState<string>("");
  const [canShareQuote, setCanShareQuote] = useState<boolean>(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedImageUrl(null);
      const file = acceptedFiles[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFile(file);
      setCanUpload(true);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg"] },
  });

  const handleUploadClick = async () => {
    const mediaUrl = await quotesService.uploadImage(file!);
    if (typeof mediaUrl === "string") {
      toast({
        title: "Image Uploaded!",
        description: "Your image has been uploaded successfully!",
        variant: "success",
      });
      setUploadedImageUrl(mediaUrl);
      setCanUpload(false);
    } else {
      toast({
        title: "Oops! Something went wrong",
        description: "Couldn't upload your image. Try again later!",
        variant: "destructive",
      });
    }
  };

  const handleQuoteChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    value.length > 0 ? setCanShareQuote(true) : setCanShareQuote(false);

    if (value.length <= 255) {
      setQuote(value);
    }
  };

  const handleShareClick = async () => {
    if (!uploadedImageUrl) {
      toast({
        title: "Image Required!",
        description: "Please upload an image before sharing your quote!",
        variant: "destructive",
      });
      return;
    }

    if (quote.length == 0) {
      toast({
        title: "Quote Required!",
        description: "Please enter a quote before sharing!",
        variant: "destructive",
      });
      return;
    }
    const response = await quotesService.shareQuote(quote, uploadedImageUrl!);

    if (response === "success") {
      toast({
        title: "Quote Shared!",
        description: "Your wisdom has been shared with the world!",
        variant: "success",
      });
      setCanShareQuote(false);
      setCanUpload(false);
      router.back();
    } else {
      toast({
        title: "Oh no! Couldn't share your quote",
        description: "An error occurred. Please try again later!",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Header
        actionButtons={[
          <button
            className="relative w-10 max-w-[40px] h-10 max-h-[40px] rounded-full border-black border-2"
            type="button"
            onClick={() => {
              authService.logout();
              window.location.reload()
            }}
          >
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <MdLogout size={20} />
            </span>
          </button>,
        ]}
      />
      <div className="flex m-8 justify-between">
        <div className="flex-col w-[50%]">
          <h1 className="text-2xl font-bold mb-4">Upload Image Here</h1>
          <div
            {...getRootProps()}
            className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col justify-center items-center ${
              isDragActive ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop an image here, or click to select one</p>
            )}
          </div>
          <button
            onClick={handleUploadClick}
            disabled={!canUpload}
            className={`bg-black text-white font-bold py-2 px-4 rounded mt-4 ${
              canUpload ? "cursor-pointer" : "cursor-not-allowed opacity-50"
            }`}
          >
            Upload
          </button>
        </div>
        {selectedImage && (
          <div className="relative w-64 h-64 mt-4">
            <Image
              src={selectedImage}
              alt="Selected Image"
              layout="fill"
              objectFit="cover"
              className="rounded-lg mt-8"
            />
          </div>
        )}
      </div>
      <div className="m-8 mt-14 w-1/2">
        <h2 className="text-xl font-bold mb-4">Drop Some Wisdom</h2>
        <textarea
          value={quote}
          onChange={handleQuoteChange}
          className="w-full h-48 p-2 border border-gray-300 rounded-lg"
          placeholder="Run your wisdom wild here (max 255 characters)"
        />
        <p className="text-right text-sm text-gray-500">{quote.length}/255</p>
        <button
          onClick={handleShareClick}
          disabled={!canShareQuote}
          className={`bg-black text-white font-bold py-2 px-4 rounded ${
            canShareQuote ? "cursor-pointer" : "cursor-not-allowed opacity-50"
          }`}
        >
          Share
        </button>
      </div>
    </div>
  );
}
