import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../../spinner/Spinner';
import { SpotifyItem } from '../../../types/spotifyTypes';
import { fetchSpotifyItemDetails } from '../../../api/ApiDetails';
import './ItemDetails.css';

const ItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<SpotifyItem | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItemDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedItem = await fetchSpotifyItemDetails(id!);
                console.log('Fetched Item:', fetchedItem); // Debugging line
                setItem(fetchedItem);
            } catch (error) {
                console.error('Error fetching item details:', error);
                setError('Error fetching item details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchItemDetails();
    }, [id]);

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!item) {
        return <div>No item details available.</div>;
    }

    return (
        <div className="item-details-container">
            <Link to="/">
                <i className="fas fa-list"> List View</i>
            </Link>
            <Link to="/grid">
                <i className="fas fa-th"> Grid View</i>
            </Link>
            <div className="scroll-view">
                <div className="item-details">
                    <img
                        src={item.album.images[0]?.url || 'placeholder-image-url'}
                        alt={item.name}
                        className="item-image"
                    />
                    <div className="item-info">
                        <h2>{item.name}</h2>
                        <p><strong>Artista:</strong> {item.artists.map(artist => artist.name).join(', ')}</p>
                        <p><strong>Álbum:</strong> {item.album.name}</p>
                        <p><strong>Fecha de Lanzamiento:</strong> {item.album.release_date}</p>
                        <p><strong>Popularidad:</strong> {item.popularity}</p>
                        <p><strong>Duración:</strong> {Math.floor(item.duration_ms / 60000)}:{((item.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')} minutos</p>
                        <p><strong>Mercados Disponibles:</strong> {item.available_markets.length}</p>
                        <p><strong>Explícito:</strong> {item.explicit ? 'Sí' : 'No'}</p>
                        <p><strong>Número de Pista:</strong> {item.track_number}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetails;