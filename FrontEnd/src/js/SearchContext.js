import React, { createContext, useContext, useState } from "react";

/* Creazione del contesto per la gestione globale del termine di ricerca */
const SearchContext = createContext();

/* Provider che avvolge i componenti figli e fornisce stato + updater */
export function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState(""); // Stato condiviso: input di ricerca

  return <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>{children}</SearchContext.Provider>;
}

/* Hook personalizzato per consumare rapidamente il contesto */
export function useSearch() {
  return useContext(SearchContext);
}
