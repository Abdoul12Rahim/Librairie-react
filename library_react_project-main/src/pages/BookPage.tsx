import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBookDetail, fetchWikipedia } from "../api";
import { useLibrary, ReadingStatus } from "../context/LibraryContext";
// Page de détails d'un livre
export const BookPage = () => {
  const { id } = useParams();
  const { isFavorite, toggleFavorite, getReadingStatus, setReadingStatus } = useLibrary();

  // 1. Appel API Livre
  const { data: book, isLoading: loadingBook } = useQuery({
    queryKey: ["book", id],
    queryFn: () => fetchBookDetail(id!),
  });

  // 2. Appel API Wikipedia (Dépendant du livre)
  const { data: wiki, isLoading: loadingWiki } = useQuery({
    queryKey: ["wiki", book?.title],
    queryFn: () => fetchWikipedia(book.title),
    enabled: !!book?.title, // Ne s'exécute que si le livre est chargé
  });

  if (loadingBook) return <p>Chargement du livre...</p>;
  if (!book) return <p>Livre introuvable.</p>;

  // Logique d'extraction du texte Wikipedia (l'API renvoie une structure complexe)
  const getWikiExtract = () => {
    if (!wiki?.query?.pages) return "Pas d'infos Wikipedia trouvées.";
    const pages = wiki.query.pages;
    const pageId = Object.keys(pages)[0];
    return pageId === "-1" ? "Pas d'article Wikipedia pour ce titre précis." : pages[pageId].extract;
  };

  const fav = isFavorite(id!);
  const status = getReadingStatus(id!);

  const handleFavorite = () => {
    toggleFavorite({
      id: id!,
      title: book.title,
      coverId: book.covers?.[0],
    });
  };

  const handleStatus = (newStatus: ReadingStatus | null) => {
    setReadingStatus(id!, newStatus === status ? null : newStatus);
  };

  return (
    <div>
      <Link to="/search" className="back-link">← Retour à la recherche</Link>
      
      <div className="book-detail-layout">
        {/* Colonne Image */}
        <div className="book-detail-cover">
           {book.covers ? (
             <img 
               src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`} 
               alt={book.title}
               className="book-detail-img"
             />
           ) : (
             <div className="book-cover-placeholder">📖</div>
           )}

           {/* Actions */}
           <div className="book-actions">
             <button
               className={`btn-fav-large${fav ? " active" : ""}`}
               onClick={handleFavorite}
             >
               {fav ? "❤️ Dans mes favoris" : "🤍 Ajouter aux favoris"}
             </button>

             <div className="status-selector">
               <p className="status-label">Statut de lecture :</p>
               <div className="status-buttons">
                 <button
                   className={`btn-status${status === "to-read" ? " active-to-read" : ""}`}
                   onClick={() => handleStatus("to-read")}
                 >
                   📌 À lire
                 </button>
                 <button
                   className={`btn-status${status === "read" ? " active-read" : ""}`}
                   onClick={() => handleStatus("read")}
                 >
                   ✅ Déjà lu
                 </button>
               </div>
             </div>
           </div>
        </div>

        {/* Colonne Infos */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{book.title}</h1>

          {/* Badge statut affiché dans les infos aussi */}
          {status && (
            <span className={`status-badge status-badge-${status}`}>
              {status === "read" ? "✅ Déjà lu" : "📌 À lire"}
            </span>
          )}

          <h3>Description (OpenLibrary)</h3>
          <p>{typeof book.description === 'string' ? book.description : book.description?.value || "Pas de description officielle."}</p>

          <hr style={{ margin: "20px 0" }} />
          
          <h3>Savoir encyclopédique (Wikipedia)</h3>
          {loadingWiki ? <p>Recherche sur Wikipedia...</p> : (
            <p className="wiki-extract">
              {getWikiExtract()}
            </p>
          )}
          
          {/* Lien vers la page Wiki */}
          <a 
            href={`https://en.wikipedia.org/wiki/${book.title}`} 
            target="_blank" 
            rel="noreferrer"
            className="wiki-link"
          >
            Voir l'article complet sur Wikipedia →
          </a>
        </div>
      </div>
    </div>
  );
};