import axios from 'axios';
import getAccessToken from '../auth/auth';
import { SpotifyItem } from '../types/spotifyTypes';

export const fetchFilteredSpotifyItems = async (query: string, genre: string, releaseDate: string): Promise<SpotifyItem[]> => {
    const token = await getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            q: query,
            type: 'track,album,artist',
        },
    });

    const items: SpotifyItem[] = [
        ...response.data.tracks.items.map((track: any) => ({
            id: track.id,
            name: track.name,
            album: {
                name: track.album.name,
                release_date: track.album.release_date,
                images: track.album.images,
            },
            artists: track.artists.map((artist: any) => ({
                name: artist.name,
            })),
            release_date: track.album.release_date,
            type: 'track',
        })),
        ...response.data.albums.items.map((album: any) => ({
            id: album.id,
            name: album.name,
            album: {
                name: album.name,
                release_date: album.release_date,
                images: album.images,
            },
            artists: album.artists.map((artist: any) => ({
                name: artist.name,
            })),
            release_date: album.release_date,
            type: 'album',
        })),
        ...response.data.artists.items.map((artist: any) => ({
            id: artist.id,
            name: artist.name,
            album: {
                name: '',
                release_date: '',
                images: artist.images,
            },
            artists: [],
            release_date: '',
            type: 'artist',
        })),
    ];

    // Apply additional filters after fetching if needed
    // Example: Filter by genre and releaseDate

    return items;
};