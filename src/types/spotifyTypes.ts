export interface SpotifyTrack {
    id: string;
    name: string;
}

export interface SpotifyImage {
    url: string;
    height: number;
    width: number;
}

export interface SpotifyArtist {
    name: string;
}

export interface SpotifyAlbum {
    name: string;
    release_date: string;
    images: SpotifyImage[];
}

export interface SpotifyItem {
    id: string;
    name: string;
    album: SpotifyAlbum;
    artists: SpotifyArtist[];
    release_date: string;
    type: string;
    genres?: string[];
    images: SpotifyImage[];
    tracks: { items: SpotifyTrack[] };
}

export interface SpotifyImage {
    url: string;
    height: number;
    width: number;
}

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: SpotifyImage[];
        release_date: string;
    };
    popularity: number;
    duration_ms: number;
    available_markets: string[];
    explicit?: boolean;
    track_number?: number;
}


export interface SpotifyItem extends SpotifyTrack {}