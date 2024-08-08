'use client';
import Image from 'next/image';
import { Card, CardDescription, CardFooter, CardTitle } from '@/app/components/ui/card';
import React, { useEffect, useState } from 'react';
import quotesService from '../services/quotes';
import useScrollPosition from '../hooks/scroll_position';
import { useRouter } from 'next/navigation';

import { MdAdd, MdLogout } from 'react-icons/md';
import Header from '../components/header';
import authService from '../services/auth';

export default function Feed() {
  const router = useRouter();

  const scrollPosition = useScrollPosition();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const getQuotes = async (source: string): Promise<void> => {
    setLoading(true);
    const newQuotes = await quotesService.getQuotes();
    setQuotes((prevQuotes) => [...prevQuotes, ...newQuotes]);
    setLoading(false);
  };

  useEffect(() => {
    if (scrollPosition > 90 && !loading) {
      getQuotes('scroll');
    }
  }, [scrollPosition, loading]);

  useEffect(() => {
    if (!loading) {
      getQuotes('initial');
    }
  }, [loading]);

  const navigateToCreateQuote = () => {
    router.push('/create-quote');
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
      <div>
        <div className="flex-col flex justify-center items-center p-8">
          {quotes.map((quote) => (
            <Card key={quote.id} className="quote-card relative overflow-hidden m-8">
              <div className="relative">
                <Image
                  src={quote.mediaUrl}
                  alt="Quotopia"
                  width={500}
                  height={500}
                  className="object-cover w-[500px] h-[500px]"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                  <CardTitle className="text-white text-lg font-bold text-center">
                    {quote.text}
                  </CardTitle>
                </div>
              </div>
              <CardFooter className="flex flex-row justify-between p-4">
                <CardDescription className="flex items-center text-lg text-black">
                  <Image
                    src="/avatar.jpg"
                    alt={`${quote.username}'s avatar`}
                    width={30}
                    height={30}
                    className="rounded-full mr-2"
                  />
                  {quote.username}
                </CardDescription>
                <p className="text-lg text-black">{quote.createdAt}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
        <button
          className="fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-2xl bg-black mr-4"
          type="button"
          onClick={navigateToCreateQuote}
        >
          <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-white">
            <MdAdd size={32} />
          </span>
        </button>
      </div>
    </div>
  );
}
