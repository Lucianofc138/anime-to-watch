import { Anime } from '../types'

export function MiniAnimeCard({ 
    anime, 
    disabled = false,
    onClick 
}: { 
    anime: Anime, 
    disabled: boolean,
    onClick: (anime: Anime) => void
}) {
    return (
        <div 
            className={`aspect-[3/4] flex justify-center items-center overflow-hidden rounded relative group ${disabled ? '' : 'cursor-pointer'}`}
            onClick={() => !disabled && onClick(anime)}
        >
            <img
                src={anime.coverImage.large}
                alt={anime.title.english ?? anime.title.romaji}
                className={`object-cover rounded transition-transform duration-300 ease-in-out ${!disabled ? 'group-hover:scale-110' : 'opacity-50'}`}
            />
            <h2 className="text-lg font-bold mb-2 absolute bottom-0 left-0 right-0 bg-black bg-opacity-80">
                {anime.title.english ?? anime.title.romaji}
            </h2>
        </div>
    );
}