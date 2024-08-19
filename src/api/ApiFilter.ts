import axios from 'axios';
import getAccessToken from '../auth/auth';
import { SpotifyItem } from '../types/spotifyTypes';

export const fetchFilteredSpotifyItems = async (query: string, popularityMin: string, popularityMax: string, releaseDateStart: string, releaseDateEnd: string): Promise<SpotifyItem[]> => {
    const token = await getAccessToken();

    // Log the request parameters for debugging
    console.log('Request Parameters:', {
        q: query,
        type: 'track,album,artist',
        popularityMin,
        popularityMax,
        releaseDateStart,
        releaseDateEnd
    });

    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                q: query,
                type: 'track,album,artist',
            },
        });

        let items: SpotifyItem[] = [
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
                popularity: track.popularity,
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
                popularity: album.popularity,
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
                popularity: artist.popularity,
                type: 'artist',
            })),
        ];

        // Apply additional filters after fetching if needed
        if (popularityMin) {
            items = items.filter(item => item.popularity >= parseInt(popularityMin, 10));
        }
        if (popularityMax) {
            items = items.filter(item => item.popularity <= parseInt(popularityMax, 10));
        }
        if (releaseDateStart) {
            items = items.filter(item => item.release_date >= releaseDateStart);
        }
        if (releaseDateEnd) {
            items = items.filter(item => item.release_date <= releaseDateEnd);
        }

        return items;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};