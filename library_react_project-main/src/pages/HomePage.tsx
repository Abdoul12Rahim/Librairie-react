import { useQuery } from "@tanstack/react-query";
import { fetchTrendingBooks } from "../api";
import { Link } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
// Page d'accueil affichant les livres tendances
export const HomePage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrendingBooks,
  });
  const { isFavorite, toggleFavorite } = useLibrary();

  if (isLoading) return <div className="loading-state">Chargement...</div>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>Erreur de chargement</p>;

  return (
    <div style={{ width: "100%" }}>
      
      {/* Bannière de titre */}
      <div className="page-banner">
        <h1>📚 Bibliothèque Municipale</h1>
        <p>Découvrez les tendances du moment</p>
      </div>
      
      <h2 className="section-title">🔥 Tendances du jour</h2>

      {/* Grille Responsive */}
      <div className="book-grid">
        
        {data?.works?.map((book: any) => {
          const id = book.key.split("/").pop();
          const fav = isFavorite(id);
          return (
            <div key={book.key} className="book-card">
              {/* Bouton favori */}
              <button
                className={`btn-fav${fav ? " active" : ""}`}
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

              <Link to={`/book/${id}`} style={{ textDecoration: "none", flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Conteneur Image */}
                <div className="book-cover">
                  {book.cover_i ? (
                    <img 
                      src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`} 
                      alt={book.title} 
                      style={{ height: "100%", width: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: "3rem" }}>📖</span>
                  )}
                </div>

                {/* Conteneur Info */}
                <div className="book-card-body">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">
                    {book.author_name ? book.author_name[0] : "Auteur inconnu"}
                  </p>
                  <div className="book-card-footer">
                    <span className="btn-details">Voir le détail →</span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};