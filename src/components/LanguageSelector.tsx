import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("language", lng);
    };

    return (
        <form className="max-w-sm mx-auto">
            <select
                onChange={(e) => changeLanguage(e.target.value)}
                defaultValue={localStorage.getItem("language") || "en"}
                className="absolute right-4 top-4"
            >
                <option value="en" className="p-4">🇺🇸 {t('english')}</option>
                <option value="es" className="p-4">🇪🇸 {t('spanish')}</option>
            </select>
        </form>
    );
};

export default LanguageSelector;
