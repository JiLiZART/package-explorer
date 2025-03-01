"use client";

import React, { createContext, useContext, useState } from "react";

interface SearchQueryContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchQueryContext = createContext<SearchQueryContextType | undefined>(
  undefined
);

export function SearchQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchQueryContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchQueryContext.Provider>
  );
}

export function useSearchQuery() {
  const context = useContext(SearchQueryContext);
  if (context === undefined) {
    throw new Error("useSearchQuery must be used within a SearchQueryProvider");
  }
  return context;
}
