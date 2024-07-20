import { Anime } from "../types";

export function AnimeChip ({ 
    anime, 
    onClick 
} : {
    anime: Anime, 
    onClick: (anime: Anime) => void
}){

    return (
        <div 
            className="flex items-center px-3 py-2 rounded-lg bg-[#080808] cursor-pointer transition duration-200 ease-in-out hover:bg-[#181818]"
            onClick={() => onClick(anime)}
        >
            <span className="mr-3 text-sm text-gray-300">
                {anime.title.romaji ?? anime.title.english}
            </span>
            <span 
                className="mr-3 text-lg font-medium text-gray-300 hover:text-white"
            >
                &times;
            </span>
        </div>
    )
};