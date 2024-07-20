export interface Anime {
    id: string;
    title: {
        romaji: string;
        english: string;
    };
    coverImage: {
        large: string;
    };
    synonyms: string[];
    averageScore: number;
    status: string;
    episodes: number;
    type: string;
    seasonYear: number;
}


export interface AnimeSelector {
    searchString: string;
    setSearchString: (value: any) => void; 
    selectedAnime: Anime[];
    addToSelectedAnime: (anime: Anime) => void;
    removeFromSelectedAnime: (anime: Anime) => void;
    searchedAnime: Anime[],
    setSearchedAnime: (anime: any) => void;
    handleSearch: (any: any) => void;
    loading: boolean;
}