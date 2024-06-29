export interface Anime {
    id: string;
    title: {
        romaji: string;
        english: string;
    };
    coverImage: {
        large: string;
    };
    averageScore: number;
    status: string;
    episodes: number;
    type: string;
    seasonYear: number;
}
