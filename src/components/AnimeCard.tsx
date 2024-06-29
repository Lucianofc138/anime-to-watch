import { Anime } from '../types'

// export function AnimeCard({
//     anime
// }: {
//     anime: Anime
// }) {
//     return (
//         <>
//             <div>
//             {anime.title.english || anime.title.romaji}
//             {/* <image src={anime.coverImage.large} alt={anime.title.english || anime.title.romaji} style={{ width: '100px', height: '150px' }} /> */}
//             </div>
//         </>
//     );
// }

export function AnimeCard({ anime }: { anime: Anime }) {
    return (
        <div className="h-60 m-2 gap-2 flex flex-row">
            <div className="aspect-[3/4] flex justify-center items-center overflow-hidden rounded" >
                <img
                    src={anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
                    className="object-cover rounded"
                />
            </div>

            <div className="w-72">
                <h2 className="text-lg font-bold mb-2">
                    {anime.title.english || anime.title.romaji}
                </h2>
                <p className="text-sm text-white-600 mb-2">
                    Score: {anime.averageScore || 'N/A'}
                </p>
                <p className="text-sm text-white-700">
                    Status: {anime.status || 'Unknown'}
                </p>
                <p className="text-sm text-white-700">
                    Episodes: {anime.episodes || 'Unknown'}
                </p>
                <p className="text-sm text-white-700">
                    Type: {anime.type || 'Unknown'}
                </p>
                <p className="text-sm text-white-700">
                    Season Year: {anime.seasonYear || 'Unknown'}
                </p>
            </div>
        </div>
    );
}