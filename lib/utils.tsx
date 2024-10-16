
export interface LrcsSearchresult {
  album: string;
  artist: string;
  id: string;
  lyrics: string;
  ratio: number;
  title: string;
}

export interface LrcsResult extends Omit<LrcsSearchresult, 'lyrics'> {
  lyrics: LyricLine[];
}

export type LyricLine = {
  time: string;
  content: string;
};


