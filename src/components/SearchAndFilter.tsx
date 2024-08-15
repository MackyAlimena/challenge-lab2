// src/components/SearchAndFilter.tsx
import React, { useState } from 'react';
import axios from 'axios';
import getAccessToken from '../auth/auth';
import { SpotifyItem } from '../types/spotifyTypes'; // Adjust the path as needed

interface SearchAndFilterProps {
    onSearch: (items: SpotifyItem[]) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ onSearch }) => {
    const [query, setQuery] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [releaseDate, setReleaseDate] = useState<string>('');

    const handleSearch = async () => {
        try {
            const token = await getAccessToken();
            const response = await axios.get('https://api.spotify.com/v1/search', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    q: query,
                    type: 'track,album,artist',
                    // Spotify API does not support genre and release_date directly in the search params
                    // So, these filters would be applied after fetching the data
                },
            });

            // Extract and combine the results into a single list
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

            onSearch(items);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
            />
            <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Género..."
            />
            <input
                type="text"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                placeholder="Fecha de lanzamiento..."
            />
            <button onClick={handleSearch}>Buscar</button>
        </div>
    );
};

export default SearchAndFilter;
