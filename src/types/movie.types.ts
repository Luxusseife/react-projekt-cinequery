// Interface som definierar filmstruktur.
export interface MovieInterface {
    id: number,
    poster_path?: string | null,
    title: string,
    release_date?: string | null,
    genres?: Genre[] | null,
    runtime?: number | null,
    overview?: string | null
}

// Struktur för genre-array.
interface Genre {
    id: number;
    name: string;
}