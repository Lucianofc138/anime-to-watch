import { ApolloClient, useApolloClient } from '@apollo/client';
import { GET_ANIME_BY_IDS, GET_ANIME_RECOMMENDATIONS_BY_ANIME_IDS } from './schemas/queries'
import { useState } from 'react';
import { AnimeCard } from './components/AnimeCard';
import { MiniAnimeCard } from './components/MiniAnimeCard';
import { AnimeChip } from './components/AnimeChip';
import { Anime } from './types';
import { useAnimeSelector } from './hooks/useAnimeSelector'

interface AnimeRecommendator {
  recommendations: Anime[],
  recommendationsSorted: Anime[],
  hasRecommendations: boolean,
  recommendByAnimeIdList: (animeIdList: string[]) => Promise<void>,
  loading: boolean,
}

async function getAnimeRecommendations({ 
  client, 
  animeIdList 
} : { 
  client: ApolloClient<object>, 
  animeIdList: string[] 
}) : Promise<string[]> {
    const getAnimeRecommendationData = {
      query: GET_ANIME_RECOMMENDATIONS_BY_ANIME_IDS,
      variables: {
        ids: animeIdList,
      }
    };

    const response = await client.query(getAnimeRecommendationData)
    return response.data.Page.media;
}

async function getAnimeInfoByIds({ 
  client, 
  animeIdList 
} : { 
  client: ApolloClient<object>, 
  animeIdList: string[] 
}) : Promise<Anime[]> {
  const getAnimeRecommendationInfoData = {
    query: GET_ANIME_BY_IDS,
    variables: {
      ids: animeIdList,
    }
  };
  

  const response = await client.query(getAnimeRecommendationInfoData);
  return response.data.Page.media;
}

type recommendationResult = "OK" | "ERROR" | null;

function useAnimeRecommendator({ client } : { client: ApolloClient<object>}): AnimeRecommendator {
  const [recommendations, setRecommendations] = useState<Anime[]>([] as Anime[]);
  const [recommendationResult, setRecommendationResult] = useState<recommendationResult>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const recommendByAnimeIdList = async (animeIdList: string[]) => {
    setLoading(true);
    try {
      const recommendedMedia = await getAnimeRecommendations({ client, animeIdList });
      console.log('recommendedMedia: ', recommendedMedia);
      
      const getRecommendationIds = mediaElement => mediaElement.recommendations.edges
        .map(e => e.node.mediaRecommendation.id);

      const recommendationIds = recommendedMedia
        .map(getRecommendationIds)
        .reduce((prev: Array<string>, curr: string) => {
          return [...prev, ...curr];
      }, [])

      console.log("Recommendation Ids: ", recommendationIds)
    
      const recommendedAnime = await getAnimeInfoByIds({ client, animeIdList: recommendationIds });
      console.log("ANIME INFO RESPONSE: ", recommendedAnime);
      setRecommendations(recommendedAnime as Anime[]);
      setRecommendationResult("OK");
    } catch (e) {
      console.error(e);
      setRecommendationResult("ERROR");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationsSorted = () => {
    const maxPopularity = recommendations.reduce((prev: number, curr: Anime) => {
      return Math.max(prev, curr?.popularity);
    }, 0);

    const getF1Score = (anime: Anime) : number => {
      const weightedPopularity = Math.sqrt(anime.popularity / maxPopularity);
      const weightedScore = anime.averageScore / 100;
      const scoreWeight = 1; 
    
      const adjustedPopularity = weightedPopularity / scoreWeight;
      return (2 * (adjustedPopularity * weightedScore) / (adjustedPopularity + weightedScore));
    };
    
    const compareAnime = (a: Anime, b: Anime) : number => {
      const f1ScoreA = a?.weightedScore ?? getF1Score(a) * 100;
      const f1ScoreB = b?.weightedScore ?? getF1Score(b) * 100;
      return f1ScoreB - f1ScoreA;
    }
  
    return recommendations
      .map((a) => ({...a, weightedScore: 100 * getF1Score(a)}))
      .sort(compareAnime);
  };

  return {
    recommendations,
    recommendationsSorted: getRecommendationsSorted(),
    hasRecommendations: recommendationResult === "OK",
    recommendByAnimeIdList,
    loading,
  }
}

function App() {
  const client = useApolloClient();

  const animeSelector = useAnimeSelector({ client });
  const animeRecommendator = useAnimeRecommendator({ client });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    animeSelector.setSearchString(event.target.value);
  };

  const deploySelectedList = () => {
    return (
      <ul className="flex flex-wrap gap-2">
        {animeSelector.selectedAnime.map((anime: Anime) => (
          <li key={anime.id} >
            <AnimeChip 
              anime={anime} 
              onClick={() => animeSelector.removeFromSelectedAnime(anime)} 
            />
          </li>
        ))}
      </ul>
      

    )
  }

  const deploySearchList = () => {
    const checkIfSelected = (anime: Anime) => {
      return Boolean(animeSelector.selectedAnime.find((item: Anime) => item.id === anime.id));
    };
    
    return (
      <ul className="flex justify-evenly flex-wrap gap-5">
      {animeSelector.searchedAnime
        .filter((anime: Anime) => !checkIfSelected(anime))
        .map((anime: Anime) => (
          <li key={anime.id}>
            <MiniAnimeCard anime={anime} disabled={checkIfSelected(anime)} onClick={(anime: Anime) => {
              console.log('click on', anime.id, anime.title.romaji, anime.title.english)
              animeSelector.addToSelectedAnime(anime);
            }}/>
          </li>
      ))}
    </ul>
    );
  };

  const deployRecommendations = () => {
    return (
      <>
        <button onClick={() => window.location.reload()}>Restart</button>
        <ul className="flex justify-evenly flex-wrap gap-5">
          {animeRecommendator.recommendationsSorted.map((anime: Anime) => (
            <li key={anime.id}>
              <AnimeCard anime={anime}/>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <main className="flex flex-col justify-center items-center m-5 p-5 gap-5 ">
      <h1>Anime to Watch</h1>
      { !animeRecommendator.hasRecommendations && !animeRecommendator.loading && (
        <>
          <div className="w-full md:w-2/3 lg:w-1/2 m-5">
            <input
              className="p-2 w-full"
              placeholder='Introduce your anime'
              value={animeSelector.searchString}
              onChange={handleInputChange}
            />

        </div>
        <button 
          onClick={() => 
            animeRecommendator.recommendByAnimeIdList(animeSelector.selectedAnime.map((anime: Anime) => anime.id))
          }
        >
            Get Recommendations
        </button>
        </>
      )}

      { animeRecommendator.hasRecommendations && !animeRecommendator.loading &&
        deployRecommendations()
      }
      
      { !animeRecommendator.hasRecommendations && animeRecommendator.loading && 
        <p>Loading...</p>
      }

      {!animeRecommendator.hasRecommendations && !animeRecommendator.loading &&
        <>
          {deploySelectedList()}
          {deploySearchList()}
        </>
      }
    </main>
  )
}

export default App
