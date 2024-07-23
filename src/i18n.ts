// src/i18n/index.ts

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            get_recommendations: "get recommendations",
            search_anime: "search anime",
            selected_anime: "selected anime",
            recommendations: "recommendations",
            loading: "loading",
            score: "score",
            status: "status",
            episodes: "episodes",
            type: "type",
            season_year: "season year",
            views: "views",
            weighted_score: "weighted score",
            english: "english",
            spanish: "spanish",
            restart: "restart",
            language: "language",
        },
    },
    es: {
        translation: {
            get_recommendations: "obtener recomendaciones",
            search_anime: "buscar anime",
            selected_anime: "anime seleccionado",
            recommendations: "recomendaciones",
            loading: "cargando",
            score: "puntuación",
            status: "estado",
            episodes: "episodios",
            type: "tipo",
            season_year: "año de temporada",
            views: "vistas",
            weighted_score: "puntuación ponderada",
            english: "inglés",
            spanish: "español",
            restart: "reiniciar",
            language: "idioma",
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: localStorage.getItem("language") || "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
