import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { searchBooks } from "../api";
import { useLibrary } from "../context/LibraryContext";
// Page de recherche avancée
export const SearchPage = () => {
  // États pour les filtres
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState(""); 
  const [isbn, setIsbn] = useState("");       

  const { isFavorite, toggleFavorite } = useLibrary();

  // On debounce CHAQUE champ 
  // on a regroupe tout dans un objet pour n'avoir qu'un seul debounce
  const [filters] = useDebounce({ title, author, subject, isbn }, 800); 

  // La requête écoute l'objet 'filters' qui ne change que quand tu arrêtes d'écrire
  const { data, isLoading } = useQuery({
    queryKey: ["advanced-search", filters], 
    queryFn: () => searchBooks(filters),
    // Ne lance pas la recherche si tout est vide
    enabled: !!(filters.title || filters.author || filters.subject || filters.isbn),
  });

  return (
    <div>
      <div className="page-banner">
        <h1>🔎 Recherche Avancée</h1>
        <p>Trouvez un livre par titre, auteur, genre ou ISBN</p>
      </div>
      
      {/* Grille de formulaire */}
      <div className="search-form-grid">
        
        <div className="form-group">
          <label className="form-label">Titre</label>
          <input 
            type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
            className="form-input" placeholder="Harry Potter..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Auteur</label>
          <input 
            type="text" value={author} onChange={(e) => setAuthor(e.target.value)} 
            className="form-input" placeholder="J.K. Rowling..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Sujet / Genre</label>
          <input 
            type="text" value={subject} onChange={(e) => setSubject(e.target.value)} 
            className="form-input" placeholder="Fantasy, Horror, Science..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">ISBN</label>
          <input 
            type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} 
            className="form-input" placeholder="978-..."
          />
        </div>
      </div>

      {isLoading && <p className="loading-state">Recherche en cours...</p>}

      {/* Résultats */}
      <div className="search-results-grid">
        {data?.docs?.map((book: any) => {
           const id = book.key.split("/").pop();
           const fav = isFavorite(id);
           return (
            <div key={book.key} className="search-result-card">
              {book.cover_i && (
                 <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`} alt="" className="search-result-cover" />
              )}
              <div className="search-result-info">
                <h4 className="book-title" style={{ margin: "0 0 5px" }}>{book.title}</h4>
                <p style={{ fontSize: "0.8rem", color: "#666", margin: "0 0 8px" }}>{book.author_name?.[0]}</p>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <Link to={`/book/${id}`} className="btn-details">Voir →</Link>
                  <button
                    className={`btn-fav${fav ? " active" : ""}`}
                    style={{ position: "static" }}
                    onClick={() => toggleFavorite({
                      id,
                      title: book.title,
                      author: book.author_name?.[0],
                      coverId: book.cover_i,
                    })}
                    title={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    {fav ? "❤️" : "🤍"}
                  </button>
                </div>
              </div>
            </div>
           )
        })}
      </div>
    </div>
  );
};