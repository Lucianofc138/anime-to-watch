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
                synonyms
                averageScore
                status
                episodes
                type
                seasonYear
                popularity
            }
        }
    }
`;

export const GET_ANIME_RECOMMENDATIONS_BY_ANIME_IDS = gql`
    query GetRecommendations($ids: [Int]) {
        Page {
            media(id_in: $ids, type: ANIME) {
                id
                title {
                    romaji
                    english
                }
                recommendations {
                    edges {
                        node {
                            mediaRecommendation {
                                id
                                title {
                                    userPreferred
                                }
                            }
                            userRating
                        }
                    }
                }
            }
        }
    }
`;

export const GET_ANIME_BY_IDS = gql`
    query GetAnimeByIds($ids: [Int]) {
        Page {
            media(id_in: $ids, type: ANIME) {
                id
                title {
                    romaji
                    english
                }
                coverImage {
                    large
                }
                synonyms
                averageScore
                status
                episodes
                type
                seasonYear
                popularity
            }
        }
    }
`;
