export interface WeeklyEntry {
  date: string
  youtubeId: string
  // Set to false when the video's owner has disabled embedding (YouTube shows "Video unavailable");
  // the card then shows the video's thumbnail with a link out to YouTube instead
  youtubeEmbeddable?: boolean
  videoCaption: string
  reelId: string
  reelCaption: string
}

// Most recent week first. Add new weeks to the top of this array.
export const weeklies: WeeklyEntry[] = [
  {
    date: '2026-10-25',
    youtubeId: 'Qr3VsZYQy4s',
    videoCaption: 'I really like this challenge and his execution. 9/10 video',
    reelId: 'DeDVmRZqSBP',
    reelCaption: 'Very creative resume. This ought to work but I wonder if it does. 10/10',
  },
  {
    date: '2026-10-17',
    youtubeId: 'a4vfv4EMgYs',
    youtubeEmbeddable: false,
    videoCaption: 'Bit of a cringe concept usually, but I like how it was done. Good analogy. 8/10',
    reelId: 'DefXUx8pGnw',
    reelCaption: 'I like this one particularly. 9/10',
  },
  {
    date: '2026-10-13',
    youtubeId: 'RVcPG0xvQAs',
    videoCaption: 'Good random knowledge. 8/10',
    reelId: 'Dcg2nMLxYS7',
    reelCaption: 'Good tomfoolery. 7/10',
  },
  {
    date: '2026-09-26',
    youtubeId: 'xQkibiaxP0I',
    videoCaption: 'Path of Exile 1 character build that showcases an extremely niche and powerful interaction. 9.5/10 video',
    reelId: 'C7KcgbRv7qp',
    reelCaption: 'Good storytelling and illustrations. 9/10',
  },
  {
    date: '2026-09-19',
    youtubeId: 'Ze9ffaeOLs4',
    videoCaption: 'I like SirloinBurgers. Very creative idea. 8/10 video',
    reelId: 'DZLOUZ1vQAG',
    reelCaption: 'Very kind reel. 8/10',
  }
]
