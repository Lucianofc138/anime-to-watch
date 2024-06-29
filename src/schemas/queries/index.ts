import { gql } from "@apollo/client";

export const GET_ANIME_LIST = gql`
    query GetAnimeList($search: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
            media(search: $search, type: ANIME) {
                id
                title {
                    romaji
                    english
                }
                coverImage {
                    large
                }
                averageScore
                status
                episodes
                type
                seasonYear
            }
        }
    }
`;
