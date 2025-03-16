// Interface som definierar filmstruktur.
export interface MovieInterface {
    id: number,
    poster_path: string,
    title: string,
    release_date: string,
    genre_ids: number[],
    vote_average: number
}