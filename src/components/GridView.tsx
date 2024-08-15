import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import getAccessToken from '../auth/auth';
import Spinner from './Spinner';
import { SpotifyItem } from '../types/spotifyTypes';
import '../styles/GridView.css';

const GridView: React.FC = () => {
    const [items, setItems] = useState<SpotifyItem[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = await getAccessToken();
                const response = await axios.get(
                    `https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: {
                            limit: 10,
                            offset: (page - 1) * 10,
                        },
                    }
                );

                setItems(response.data.items.map((item: any) => ({
                    ...item.track,
                    popularity: item.track.popularity // Ensure popularity is included
                }))); // Adjust based on response structure
            } catch (error) {
                console.error('Error fetching items:', error);
                setError('Error fetching items.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, [page]);

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="scroll-view">
            <button className="go-back-button" onClick={() => navigate('/')}>
                Go Back
            </button>
            <div className="grid-container">
                {items.map((item) => (
                    <div key={item.id} className="grid-item">
                        <img src={item.album.images[0]?.url} alt={item.name} />
                        <div className="grid-item-details">
                            <h2>{item.name}</h2>
                            <p><strong>Artista:</strong> {item.artists?.map(artist => artist.name).join(', ')}</p>
                            <p><strong>Álbum:</strong> {item.album.name}</p>
                            <p><strong>Fecha de Lanzamiento:</strong> {item.album.release_date}</p>
                            <Link to={`/details/${item.id}`}>Ver detalles</Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination-buttons">
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                    Previous
                </button>
                <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
            </div>
        </div>
    );
};

export default GridView;