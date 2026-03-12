import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../js/axiosInstance";

export const useGames = () => {
  const [carouselGames, setCarouselGames] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [spotlightGame, setSpotlightGame] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for search and sorting
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [pageSize] = useState(12);
  const [page, setPage] = useState(1);

  // Fetch games data
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/games");
        const games = res.data || [];

        // Set carousel games based on screen width
        const maxCarouselItems = window.innerWidth < 768 ? 6 : 15;
        setCarouselGames(games.slice(0, maxCarouselItems));

        // Sort by rating for top games
        const sortedByRating = [...games].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setTopGames(sortedByRating.slice(0, 12));
        setSpotlightGame(sortedByRating[0]);

        setAllGames(games);
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  // Filter and sort games
  const filteredAndSorted = useMemo(() => {
    let list = allGames.slice();
    if (query) {
      list = list.filter((g) => g.title.toLowerCase().includes(query.toLowerCase()));
    }
    
    switch (sortBy) {
      case "name-asc":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating-desc":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "released-desc":
        list.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        break;
      case "released-asc":
        list.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        break;
      default:
        break;
    }
    return list;
  }, [allGames, query, sortBy]);

  // Pagination
  const paginated = useMemo(() => filteredAndSorted.slice(0, page * pageSize), [filteredAndSorted, page, pageSize]);
  const hasMore = paginated.length < filteredAndSorted.length;

  const loadMore = () => setPage((p) => p + 1);
  const resetPagination = () => setPage(1);

  return {
    // Data
    carouselGames,
    topGames,
    allGames,
    spotlightGame,
    paginated,
    loading,
    hasMore,
    
    // State setters
    query,
    setQuery,
    sortBy,
    setSortBy,
    
    // Actions
    loadMore,
    resetPagination,
  };
};
