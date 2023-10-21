import React from 'react';
import i18n from '../i18n';


export const I18nContext = React.createContext({});

// Create i18n provider
export const I18nProvider: React.FC = ({ children }) => {
    return <I18nContext.Provider value={{ i18n }}>{children}</I18nContext.Provider>;
};
