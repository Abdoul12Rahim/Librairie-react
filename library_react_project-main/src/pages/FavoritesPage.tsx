import { Link } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";

const STATUS_LABELS: Record<string, string> = {
  "to-read": "À lire",
  read: "Déjà lu",
};

const STATUS_COLORS: Record<string, string> = {
  "to-read": "#f0a500",
  read: "#28a745",
};

// Page des livres favoris
export const FavoritesPage = () => {
  const { favorites, getReadingStatus, toggleFavorite } = useLibrary();
  const books = Object.values(favorites);

  if (books.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">❤️</div>
        <h2>Aucun favori pour l'instant</h2>
        <p>Ajoutez des livres à vos favoris en cliquant sur le cœur ❤️ sur une fiche livre.</p>
        <Link to="/" className="btn-primary">Découvrir des livres</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Bannière */}
      <div className="page-banner">
        <h1>❤️ Mes Favoris</h1>
        <p>{books.length} livre{books.length > 1 ? "s" : ""} sauvegardé{books.length > 1 ? "s" : ""}</p>
      </div>

      <div className="book-grid">
        {books.map((book) => {
          const status = getReadingStatus(book.id);
          return (
            <div key={book.id} className="book-card">
              {/* Couverture */}
              <div className="book-cover">
                {book.coverId ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`}
                    alt={book.title}
                    style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: "3rem" }}>📖</span>
                )}
              </div>

              {/* Infos */}
              <div className="book-card-body">
                <h3 className="book-title">{book.title}</h3>
                {book.author && <p className="book-author">{book.author}</p>}

                {/* Badge statut */}
                {status && (
                  <span
                    className="status-badge"
                    style={{ background: STATUS_COLORS[status] }}
                  >
                    {STATUS_LABELS[status]}
                  </span>
                )}

                <div className="book-card-footer">
                  <Link to={`/book/${book.id}`} className="btn-details">
                    Voir le détail →
                  </Link>
                  <button
                    className="btn-fav active"
                    onClick={() => toggleFavorite(book)}
                    title="Retirer des favoris"
                  >
                    ❤️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
