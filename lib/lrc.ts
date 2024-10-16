/* eslint-disable padding-line-between-statements */
/* eslint-disable no-console */
'use server';
import { cache } from 'react';

import { LrcsSearchresult, LrcsResult, LyricLine } from './utils';

const lrcSerarchBaseUrl = new URL('https://api.lrc.cx/api/v1/lyrics/advance');
const albumSerarchBaseUrl = new URL('https://api.lrc.cx/cover');

const parseLyrics = (lyrics: string): LyricLine[] => {
  const lines = lyrics.split('\n').filter(Boolean); // 按行分割并去掉空行
  const result: LyricLine[] = [];

  lines.forEach((line) => {
    const match = line.match(/\[(\d{2}:\d{2}\.\d{3})\](.*)/);

    if (match) {
      const time = match[1];
      const content = match[2].trim();

      result.push({ time, content });
    }
  });

  return result;
};

export const getLrcs = cache(async (
  title?: string,
  artist?: string,
  album?: string,
) => {
  console.log('getLrcs', title, artist, album);
  let searchUrl = lrcSerarchBaseUrl;

  if (title) {
    searchUrl.searchParams.append('title', title);
  }
  if (artist) {
    searchUrl.searchParams.append('artist', artist);
  }
  if (album) {
    searchUrl.searchParams.append('album', album);
  }
  if (title || artist || album) {
    console.warn('searching:', searchUrl.toString());
    try {
      const res: LrcsSearchresult[] = await fetch(searchUrl.toString()).then(
        (res) => res.json(),
      );

      try {
        const Lrcs: LrcsResult[] = res.map((lrc) => {
          return {
            ...lrc,
            lyrics: parseLyrics(lrc.lyrics),
          };
        });
        console.log('succes ,', Lrcs.length, 'Lrcs');

        return Lrcs;
      } catch (e) {
        console.error('parseLyrics error');
        console.error(e);
        return undefined;
      }
    } catch (e) {
      console.error('fetch error', e);
    }
  }

  return undefined;
})

export const getAlbumCover = cache(async (album: string) => {
  let searchUrl = albumSerarchBaseUrl;
  searchUrl.searchParams.append('album', album);
  if (album) {
    try {
      const res = await fetch(searchUrl.toString()).then((res) => res.url);
      // const url = URL.createObjectURL(res);
      console.log('succes ,', res);
      // return url;
      return res.replace('http://', 'https://');
    } catch (e) {
      console.error(e);
    }
  }

  return '/fallback.webp';
});
