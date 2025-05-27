import type { Genre } from "../types/Genre";
import { genres } from "../types/Genre";
import type { Decade } from "../types/Decade";
import { decades } from "../types/Decade";
import type { MovieFilters } from "../types/MovieFilters";

interface FilterPanelProps {
  filters: MovieFilters;
  onChange: (filters: MovieFilters) => void;
}

export default function FilteringPanel({ filters, onChange }: FilterPanelProps) {
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genre = e.target.value as Genre;
    onChange({
      ...filters,
      genre: genre === "" ? undefined : genre,
    });
  };

  const handleDecadeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const decade = parseInt(e.target.value) as Decade;
    onChange({
      ...filters,
      decade: isNaN(decade) ? undefined : decade,
    });
  };

  const resetFilters = (e: React.MouseEvent<HTMLButtonElement>) => {
    onChange({});
  };

  return (
    <section style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginBottom: "1rem" }}>
      <label>
        Genre:
        <select value={filters.genre ?? ""} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>

      <label>
        Decade:
        <select value={filters.decade ?? ""} onChange={handleDecadeChange}>
          <option value="">All Decades</option>
          {decades.map((d) => (
            <option key={d} value={d}>
              {d}s
            </option>
          ))}
        </select>
      </label>
      <button style={{ height: "40px"}} onClick={(e) => resetFilters(e)}>Reset</button>
    </section>
  );
}