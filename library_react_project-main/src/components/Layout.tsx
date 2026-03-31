import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { searchBooks } from "../api";
import { useLibrary } from "../context/LibraryContext";
// Layout avec barre de navigation et recherche rapide
export const Layout = () => {
  const [text, setText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { favorites } = useLibrary();
  const favCount = Object.keys(favorites).length;

  // 1. DEBOUNCE : La variable 'value' ne change que 500ms après la dernière frappe
  const [debouncedValue] = useDebounce(text, 500);

  // 2. QUERY : Se lance automatiquement quand debouncedValue change
  const { data } = useQuery({
    queryKey: ["quick-search", debouncedValue],
    queryFn: () => searchBooks({ q: debouncedValue }),
    enabled: debouncedValue.length > 2, // Ne cherche pas si moins de 3 lettres
  });
// Gestion du submit du formulaire de recherche rapide
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false); // Cache la liste
    if (text) navigate(`/search?q=${text}`);
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          📚 Ma Biblio
        </Link>
        
        {/* Container de la recherche pour positionner la liste relative à lui */}
        <div style={{ position: "relative", width: "300px" }}>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input 
              type="text" 
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setShowSuggestions(true);
              }}
              placeholder="Recherche rapide..."
              className="search-input"
            />
            <button type="submit" className="search-btn">🔍</button>
          </form>

          {/* LISTE DES SUGGESTIONS (Flottante) */}
          {showSuggestions && data?.docs && data.docs.length > 0 && (
            <ul className="suggestions-list">
              {data.docs.map((book: any) => {
                const id = book.key.split("/").pop();
                return (
                  <li key={book.key} className="suggestion-item">
                    <Link 
                      to={`/book/${id}`} 
                      onClick={() => setShowSuggestions(false)} // Ferme la liste au clic
                      className="suggestion-link"
                    >
                      <span style={{ fontWeight: "bold" }}>{book.title}</span>
                      <br />
                      <span style={{ fontSize: "0.8rem", color: "#666" }}>{book.author_name?.[0]}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        <div className="navbar-links">
          <Link to="/search" className="nav-link">🔎 Recherche Avancée</Link>
          <Link to="/favorites" className="nav-link nav-link-fav">
            ❤️ Favoris{favCount > 0 && <span className="fav-count">{favCount}</span>}
          </Link>
        </div>
      </nav>

      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <Outlet />
      </main>
    </div>
  );
};