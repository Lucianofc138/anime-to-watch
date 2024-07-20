import { ApolloClient } from "@apollo/client";
import { GET_ANIME_LIST } from "../schemas/queries";
import { useEffect, useState, useRef } from "react";
import { Anime, AnimeSelector } from "../types";
import { DEBOUNCE_MS } from "../constants";

export function useAnimeSelector({
    client,
}: {
    client: ApolloClient<object>;
}): AnimeSelector {
    const [searchString, setSearchString] = useState<string>("");
    const [searchedAnime, setSearchedAnime] = useState<Anime[]>([] as Anime[]);
    const [selectedAnime, setSelectedAnime] = useState<Anime[]>([] as Anime[]);
    const [loading, setLoading] = useState<boolean>(false);

    const searchDebounceTimeout = useRef<any>(null);

    // useEffect(() => {
    //     //TODO: REMOVE ONLY FOR TESTING PURPOSES
    //     setSearchString("Tensura");
    //     setTimeout(() => {
    //         handleSearch();
    //     }, 200);
    // }, []);

    const handleSearch = () => {
        setLoading(true);
        const data = {
            query: GET_ANIME_LIST,
            variables: {
                search: searchString,
                page: 1,
                perPage: 100,
            },
        };

        client
            .query(data)
            .then((response) => {
                setSearchedAnime(response.data.Page.media as Anime[]);
            })
            .catch((error) => {
                // TODO: manage error <-------------------------------------------------------------------
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        clearTimeout(searchDebounceTimeout.current);
        searchDebounceTimeout.current = setTimeout(handleSearch, DEBOUNCE_MS);
    }, [searchString]);

    const addToSelectedAnime = (anime: Anime) => {
        if (selectedAnime.find((item: Anime) => item.id === anime.id)) {
            return;
        }
        setSelectedAnime((prevState: Anime[]) => [...prevState, anime]);
    };

    const removeFromSelectedAnime = (anime: Anime) => {
        setSelectedAnime((prevState: Anime[]) =>
            prevState.filter((item: Anime) => item.id !== anime.id)
        );
    };

    useEffect(() => {
        console.log("selectedAnime", selectedAnime);
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
    };
}
