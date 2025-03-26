import styles from './GenreSelector.module.css';

interface GenreSelectorProps {
  genres: string[];
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

export default function GenreSelector({
  genres,
  selectedGenre,
  onGenreChange,
}: GenreSelectorProps) {
  return (
    <div className={styles.genreSelectorContainer}>
      <h3>Select Target Genre</h3>
      <div className={styles.genreGrid}>
        {genres.map((genre) => (
          <button
            key={genre}
            className={`${styles.genreButton} ${
              selectedGenre === genre ? styles.selected : ''
            }`}
            onClick={() => onGenreChange(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
} 