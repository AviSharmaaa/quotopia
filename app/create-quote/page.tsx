'use client';
import React, { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { MdLogout } from 'react-icons/md';
import quotesService from '../services/quotes';
import { toast } from '../components/ui/use-toast';
import { useRouter } from 'next/navigation';
import Header from '../components/header';
import authService from '../services/auth';

export default function Upload() {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageUploaded, setImageUploaded] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [quote, setQuote] = useState<string>('');
  const [canShareQuote, setCanShareQuote] = useState<boolean>(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedImageUrl(null);
      const file = acceptedFiles[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFile(file);
      setImageUploaded(true);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
  });

  const handleUploadClick = async () => {
    const mediaUrl = await quotesService.uploadImage(file!);
    if (typeof mediaUrl === 'string') {
      setUploadedImageUrl(mediaUrl);
    } else {
      setUploadedImageUrl(null);
      toast({
        title: 'Oops! Something went wrong',
        description: "Couldn't upload your image. Try again later!",
        variant: 'destructive',
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
    await handleUploadClick();
    if (uploadedImageUrl === null || uploadedImageUrl.length === 0) {
      return;
    }

    const response = await quotesService.shareQuote(quote, uploadedImageUrl!);

    if (response === 'success') {
      toast({
        title: 'Quote Shared!',
        description: 'Your wisdom has been shared with the world!',
        variant: 'success',
      });

      setSelectedImage(null);
      setImageUploaded(false);
      setFile(null);
      setUploadedImageUrl(null);
      setQuote('');
      setCanShareQuote(false);

      router.back();
    } else {
      toast({
        title: "Oh no! Couldn't share your quote",
        description: 'An error occurred. Please try again later!',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <Header
        actionButtons={[
          <button
            key={1}
            className="relative w-10 max-w-[40px] h-10 max-h-[40px] rounded-full border-black border-2"
            type="button"
            onClick={() => {
              authService.logout();
              window.location.reload();
            }}
          >
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <MdLogout size={20} />
            </span>
          </button>,
        ]}
      />
      <div className="flex m-8 mt-6 lg:justify-between justify-center">
        <div className="flex-col lg:w-[50%] w-full">
          <h1 className="text-2xl font-bold mb-4 lg:text-start text-center">Upload Image Here</h1>
          <div
            {...getRootProps()}
            className={`md:sm:relative w-full h-64 border-2 border-dashed rounded-lg flex flex-col justify-center items-center ${
              isDragActive ? 'border-blue-500' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag &lsquo;n&rsquo; drop an image here, or click to select one</p>
            )}
          </div>
        </div>
        {selectedImage && (
          <div className="lg:relative absolute w-64 h-64 mt-4 pointer-events-none">
            <Image
              src={selectedImage}
              alt="Selected Image"
              layout="fill"
              objectFit="cover"
              className="rounded-lg mt-8 lg:p-0 p-4"
            />
          </div>
        )}
      </div>
      <div className="flex-col m-8 mt-14 lg:justify-start justify-center">
        <div className="lg:w-1/2 w-full ">
          <h2 className="text-xl font-bold mb-4 lg:text-start text-center">Drop Some Wisdom</h2>
          <textarea
            value={quote}
            onChange={handleQuoteChange}
            className="w-full h-48 p-2 border border-gray-300 rounded-lg"
            placeholder="Run your wisdom wild here (max 255 characters)"
          />
          <p className="text-right text-sm text-gray-500">{quote.length}/255</p>
        </div>
        <div className="w-full flex lg:justify-start justify-center">
          <button
            onClick={handleShareClick}
            disabled={!canShareQuote || !imageUploaded}
            className={`bg-black text-white font-bold py-2 px-10 rounded g:justify-start justify-center${
              canShareQuote && imageUploaded ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
            }`}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
