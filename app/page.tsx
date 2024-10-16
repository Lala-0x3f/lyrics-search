/* eslint-disable no-console */
'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { motion } from 'framer-motion';
import { Card, CardBody } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@nextui-org/theme';
import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/image';

import { LrcsResult, LyricLine } from '@/lib/utils';
import SongsList from '@/components/songlist';
import { getLrcs } from '@/lib/lrc';

export default function Home() {
  const [content, setContent] = useState<LyricLine[]>([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState<LrcsResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<LrcsResult>();
  const [zen, setZen] = useState(false);

  const [isAnimating, setAnimating] = useState(false);
  const [onSearhFocus, setOnSearchFocus] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  const handleSearch = async () => {
    setError(false);
    setIsLoading(true);
    try {
      let results;

      results = await getLrcs(search);
      console.log(results);
      if (results) {
        console.log('success');
        setSearchResult(results);
      } else {
        // 可以设置一个空数组或处理 undefined 的情况
        setSearchResult([]);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      // 同样可以处理错误情况下的状态
      setSearchResult([]);
      setError(true);
    }
    setIsLoading(false);
  };

  const contentAnimatedIn = async (lrc: LyricLine[]) => {
    // data && setContent(data.lyrics);
    // return;
    if (isAnimating) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setAnimating(false);
    }
    console.log('contentAnimatedIn');
    console.table(content);
    setContent([]);
    setAnimating(true);
    try {
      //每 50ms 给 content 添加一行
      for (let i = 0; i < lrc.length; i++) {
        if (i < 15) await new Promise((resolve) => setTimeout(resolve, 50));
        setContent((prev) => [...prev, lrc[i]]);
      }
    } finally {
      setAnimating(false);
    }
  };

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (
        event.key === 'Escape' &&
        searchResult &&
        !isLoading &&
        InputRef.current
      ) {
        InputRef.current.blur();
        setOnSearchFocus(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, []);
  const InputRef = useRef<HTMLInputElement>(null);

  return (
    <main className='flex flex-col items-center justify-between w-full h-full overflow-clip'>
      <div className='relative w-full'>
        <div className='absolute top-0 left-0 z-0 w-full h-[90vh] overflow-clip'>
          <ScrollShadow
            className='justify-center w-full h-full text-center'
            style={{
              scrollbarWidth: 'none',
            }}
            onWheel={() => {
              if (data) {
                setOnSearchFocus(false);
              }
            }}
          >
            {content.length > 1 ? (
              <>
                <motion.div
                  animate={{ opacity: 0.2 }}
                  className='absolute flex items-center justify-center min-w-full h-[80%] opacity-30'
                  initial={{ opacity: 0 }}
                >
                  <Image
                    isBlurred
                    alt='bg'
                    className={cn(zen?'scale-125 mt-[4rem]':'mt-0','object-cover -z-10 transition-all')}
                    height={400}
                    src={`https://api.lrc.cx/cover?album=${data?.album}`}
                    width={400}
                  />
                </motion.div>
                <div className='h-[35vh]' />
                {content.map((line, index) => (
                  // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
                  <div
                    key={line.time}
                    className='w-full'
                    onClick={() => {
                      setZen(!zen);
                      setOnSearchFocus(false);
                    }}
                  >
                    <motion.p
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      className='mx-auto group text-center whitespace-pre text-pretty w-full leading-loose text-[2rem]  transition-all'
                      id={String(index)}
                      initial={{ opacity: 0, filter: 'blur(10px)' }}
                      style={{
                        scrollbarWidth: 'none',
                      }}
                    >
                      <p className='text-xs leading-[0] opacity-0 group-hover:opacity-100 transition-all text-foreground-400'>
                        {line.time}
                      </p>
                      {line.content}
                    </motion.p>
                  </div>
                ))}
                <div className='h-[35vh]' />
              </>
            ) : (
              // <p className='text-center whitespace-pre text-pretty'></p>
              <div className='flex items-center justify-center w-full h-full'>
                <motion.h1
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  className='mb-56 font-serif text-7xl'
                  initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                >
                  Wait for search lyrics...
                </motion.h1>
              </div>
            )}
          </ScrollShadow>
        </div>
      </div>
      <motion.div
        animate={{ opacity: 1 }}
        className={cn(
          zen ? '!opacity-0' : 'opacity-100',
          'flex justify-center w-[95vw] relative overflow-visible !transition-all duration-700 ease-linear h-0',
        )}
        initial={{ opacity: 0 }}
      >
        <Card
          className={cn(
            'w-full max-w-[90vw] md:max-w-[60vw] h-[20rem] relative !transition-all ease-out bg-background/10 backdrop-blur z-20',
            onSearhFocus
              ? searchResult.length > 0
                ? '-top-[20rem]'
                : isPending
                  ? '-top-[10rem]'
                  : '-top-[5rem]'
              : 'top-0 opacity-0',
          )}
        >
          <CardBody className='h-full'>
            {search && isPending ? (
              <div className='flex items-center justify-center w-full h-16'>
                <h3 className='italic animate-pulse'>Loading...</h3>
              </div>
            ) : searchResult.length > 0 ? (
              // <>{JSON.stringify(searchResult)}</>
              <SongsList
                song={searchResult}
                onChoice={(id) => {
                  const choice = searchResult.find((item) => item.id === id);

                  if (choice && choice?.lyrics.length > 1) {
                    InputRef.current?.blur();
                    setOnSearchFocus(false);
                    setData(choice);
                    contentAnimatedIn(choice.lyrics);
                  } else {
                    alert('No lyrics found');
                  }
                }}
              />
            ) : (
              <div className='flex items-center justify-center w-full h-16 font-semibold text-red-500'>
                <h3>No result found</h3>
              </div>
            )}
          </CardBody>
        </Card>
        <div className='absolute -top-[4rem]  z-30 flex justify-center w-full h-full '>
          <Card
            className={cn(
              'w-full max-w-[100vw] md:max-w-[65vw] h-[5rem] relative !transition-all ease-out bg-background/10 backdrop-blur z-20',
              onSearhFocus
                ? ''
                : 'bg-transparent shadow-none border-none backdrop-blur-none',
            )}
          >
            <CardBody className='h-full'>
              <fieldset
                className='flex w-full gap-2'
                onFocus={() => {
                  setOnSearchFocus(true);
                }}
              >
                <Input
                  ref={InputRef}
                  isClearable
                  autoComplete='off'
                  className='flex-1'
                  isInvalid={error}
                  placeholder='输入歌曲名称...'
                  value={search}
                  onClear={()=>{
                    setSearchResult([])
                  }}
                  onKeyDown={(k) => {
                    if (k.key === 'Enter') {
                      // handleSearch();
                      startTransition(handleSearch);
                    }
                    if (k.key === 'Escape' && !isLoading) {
                      setOnSearchFocus(false);
                      InputRef.current?.blur();
                    }
                  }}
                  onValueChange={async (v) => {
                    setSearch(v);
                    if (error) {
                      await new Promise((resolve) => setTimeout(resolve, 150));
                      setError(false);
                    }
                  }}
                />
                <Button
                  isIconOnly
                  className={cn(
                    'transition-all',
                    search && !isLoading && !error ? '' : 'hidden',
                  )}
                  type='submit'
                  onClick={handleSearch}
                >
                  <ArrowUpRight />
                </Button>
              </fieldset>
            </CardBody>
          </Card>
        </div>
      </motion.div>
    </main>
  );
}
