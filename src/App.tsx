import { ApolloClient, useApolloClient } from '@apollo/client';
import { GET_ANIME_LIST } from './schemas/queries'
import { useEffect, useState, useRef } from 'react';
import { AnimeCard } from './components/AnimeCard';
import { MiniAnimeCard } from './components/MiniAnimeCard';
import { AnimeChip } from './components/AnimeChip';
import { Anime, AnimeSelector } from './types';
import { DEBOUNCE_MS } from './constants';

function useAnimeSelector({ client } : { client: ApolloClient<object>}): AnimeSelector {
  const [searchString, setSearchString] = useState<string>("Tensura");
  const [searchedAnime, setSearchedAnime] = useState<Anime[]>([] as Anime[]);
  const [selectedAnime, setSelectedAnime] = useState<Anime[]>([] as Anime[]);
  const [loading, setLoading] = useState<boolean>(false);

  const searchDebounceTimeout = useRef<any>(null);

  useEffect(() => {
    setSearchString("Tensura");
    setTimeout(() => {
      handleSearch();
    }, 200);
  }, []);

  const handleSearch = () => {
    setLoading(true);
    const data = {
      query: GET_ANIME_LIST,
      variables: {
        search: searchString,
        page: 1,
        perPage: 100
      }
    };

    client.query(data)
      .then((response) => {
        setSearchedAnime((response.data.Page.media) as Anime[]);
      }).catch(error => {
        // TODO: manage error <-------------------------------------------------------------------
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    clearTimeout(searchDebounceTimeout.current);
    searchDebounceTimeout.current = setTimeout(
      handleSearch,
      DEBOUNCE_MS
    );
  }, [searchString]);

  const addToSelectedAnime = (anime: Anime) => {
    if (selectedAnime.find((item: Anime) => item.id === anime.id)) {
      return;
    }
    setSelectedAnime((prevState: Anime[]) => [...prevState, anime]);
  };

  const removeFromSelectedAnime = (anime: Anime) => {
    setSelectedAnime((prevState: Anime[]) => prevState.filter((item: Anime) => item.id !== anime.id));
  };

  useEffect(() => {
    console.log('selectedAnime', selectedAnime);
  }, [selectedAnime]);

  return {
    searchString,
    setSearchString,
    searchedAnime, 
    setSearchedAnime,
    selectedAnime,
    addToSelectedAnime,
    removeFromSelectedAnime,
    handleSearch,
    loading,
  }
}

interface AnimeRecommendator {
  recommendations: Anime[],
  hasReccomendations: boolean,
  recommendByAnimeIdList: (animeIdList: string[]) => void,
  loading: boolean,
}

function useAnimeRecommendator({ client } : { client: ApolloClient<object>}): AnimeRecommendator {
  const [recommendations, setRecommendations] = useState<Anime[]>([] as Anime[]);
  const [loading, setLoading] = useState<boolean>(false);

  const recommendByAnimeIdList = (animeIdList: string[]) => {
    setLoading(true);
    // Magia Francisco ...

    setTimeout(() => {
      setRecommendations([{}]);
    setLoading(false);
    }, 1500);

  };

  return {
    recommendations,
    hasReccomendations: recommendations.length > 0,
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
    return <p>Recommendations</p>
  };

  return (
    <main className="flex flex-col justify-center items-center m-5 p-5 gap-5 ">
      <h1>Anime to Watch</h1>
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
      { animeRecommendator.hasReccomendations &&
        deployRecommendations()
      }
      
      { !animeRecommendator.hasReccomendations && animeRecommendator.loading && 
        <p>Loading...</p>
      }

      {!animeRecommendator.hasReccomendations && !animeRecommendator.loading &&
        <>
          {deploySelectedList()}
          {deploySearchList()}
        </>
      }


      {/* HERE GOES THE SEARCH RESULTS ----------------------------------------------
      <ul className="flex justify-evenly flex-wrap gap-5">
        {animeSelector.searchedAnime.map((anime: Anime) => (
          <li key={anime.id} style={{border: "3px solid white", borderRadius: "10px"}}>
            <AnimeCard anime={anime}/>
          </li>
        ))}
      </ul>
      */}
    </main>
  )
}

export default App
