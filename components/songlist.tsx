/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { Image } from '@nextui-org/image';

import { LrcsResult } from '@/lib/utils';

const ImageItem = ({ album }: { album: string }) => {
  return (
    <Image
      className='transition-all group-hover:scale-90 aspect-square'
      fallbackSrc='/fallback.webp'
      height={48}
      src={`https://api.lrc.cx/cover?album=${album}`}
      width={48}
    />
  );
};

const SongsList = ({
  song,
  onChoice,
}: {
  song: LrcsResult[];
  onChoice: (id: string) => void;
}) => {
  if (song)
    return (
      <ul
        className='grid justify-start w-full gap-2 px-2 overflow-y-scroll sm:grid-cols-2 md:grid-cols-3 '
        style={{ scrollbarWidth: 'none' }}
      >
        {song.map((song, index) => (
          <li
            key={index}
            className='w-full h-[3rem] group flex gap-2 rounded-2xl hover:bg-secondary-50/50 transition-all duration-100 cursor-pointer overflow-clip'
            onClick={() => {
              onChoice(song.id);
            }}
          >
            <div className='size-[3rem] absolute'>
              <ImageItem album={song.album} />
            </div>
            <div className='p-1 text-sm overflow-clip text-nowrap pl-[3.5rem]'>
              <h5 className='font-semibold'>
                {song.title} -{' '}
                <span className='italic text-secondary/50'>{song.album}</span>
              </h5>
              <p>{song.artist}</p>
            </div>
          </li>
        ))}
      </ul>
    );
};

export default SongsList;
