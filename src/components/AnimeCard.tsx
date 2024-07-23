import { Anime } from '../types'
import { useTranslation } from 'react-i18next';

export function AnimeCard({ anime }: { anime: Anime }) {
    const { t } = useTranslation();
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
                    {t('score')}: {anime.averageScore || 'N/A'}
                </p>
                <p className="text-sm text-white-700">
                    {t('status')}: {anime.status || 'Unknown'}
                </p>
                <p className="text-sm text-white-700">
                    {t('episodes')}: {anime.episodes || 'Unknown'}
                </p>
                <p className="text-sm text-white-700">
                    {t('type')}: {anime.type || 'Unknown'}
                </p>
                <p className="text-sm text-white-700">
                    {t('season_year')}: {anime.seasonYear || 'Unknown'}
                </p>
                <p className="text-sm text-white-700">
                    {t('views')}: {anime.popularity || 'Unknown'}
                </p>
                {anime.weightedScore && <p className="text-sm text-white-700">
                    {t('weighted_score')}: {anime.weightedScore.toFixed(0)}
                </p>}
            </div>
        </div>
    );
}