import { useApolloClient } from '@apollo/client';
import { GET_ANIME_LIST } from './schemas/queries'
import { useState } from 'react';
import { AnimeCard } from './components/AnimeCard';
import { Anime } from './types';

function App() {
  const client = useApolloClient();

  const [animeList, setAnimeList] = useState([]);
  const [search, setSearch] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSearch = () => {
    setAnimeList([]);
    client.query({
      query: GET_ANIME_LIST,
      variables: {
        search: search,
        page: 1,
        perPage: 100
      }
    }).then((response) => {
      setAnimeList(response.data.Page.media);
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  };

  return (
    <main className="flex flex-col justify-center items-center m-5 gap-5">
      <h1>Anime to Watch</h1>
      <div className="mb-5">
        <input
          placeholder='Introduce your anime'
          value={search}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch} style={{ marginLeft: '50px' }}>Search</button>
      </div>
      <ul className="flex justify-evenly flex-wrap gap-5">
        {animeList.map((anime: Anime) => (
          <li key={anime.id} style={{border: "3px solid white", borderRadius: "10px"}}>
            <AnimeCard anime={anime}/>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
