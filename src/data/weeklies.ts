export interface WeeklyEntry {
  date: string
  youtubeId: string
  videoCaption: string
  reelId: string
  reelCaption: string
}

// Most recent week first. Add new weeks to the top of this array.
export const weeklies: WeeklyEntry[] = [
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
