// Interface som definierar recensionsstruktur.
export interface ReviewInterface {
    id: string,
    movieId: string,
    userId: string,
    rating: number,
    reviewText: string,
    createdAt: string,
    updatedAt?: string
}