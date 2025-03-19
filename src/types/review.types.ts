// Interface som definierar recensionsstruktur.
export interface ReviewInterface {
    _id: string,
    movieId: string,
    movieTitle: string,
    userId: {
        _id: string,
        username: string,
    };
    rating: number,
    reviewText: string,
    createdAt: string,
    updatedAt?: string
}