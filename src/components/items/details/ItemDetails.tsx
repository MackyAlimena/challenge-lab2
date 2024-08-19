import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../../spinner/Spinner';
import { SpotifyItem } from '../../../types/spotifyTypes';
import { fetchSpotifyItemDetails } from '../../../api/ApiDetails';


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
            <Link to="/">Go Back</Link>
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
                </div>
            </div>
        </div>
    );
};

export default ItemDetails;