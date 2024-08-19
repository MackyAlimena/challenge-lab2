import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../spinner/Spinner';
import SearchAndFilter from '../../filter/SearchAndFilter';
import { SpotifyItem } from '../../../types/spotifyTypes';
import { fetchSpotifyItems } from '../../../api/ApiList';
import './ItemList.css';
import '@fortawesome/fontawesome-free/css/all.css'; // Corrected import path

const ItemList: React.FC = () => {
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
                const fetchedItems = await fetchSpotifyItems(page);
                setItems(fetchedItems);
            } catch (error) {
                console.error('Error fetching items:', error);
                setError('Error fetching items.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, [page]);

    const handleSearch = (searchResults: SpotifyItem[]) => {
        setItems(searchResults);
    };

    return (
        <div className="item-list-container">
            <SearchAndFilter onSearch={handleSearch}/>
            <Link to="/grid">
                <i className="fas fa-th"> Grid View</i>
            </Link>
            {isLoading ? (
                <Spinner/>
            ) : error ? (
                <div>{error}</div>
            ) : (
                <div className="scroll-view">
                    <ul className="item-list">
                        {items.map((item) => (
                            <li key={item.id} className="item">
                                <Link to={`/details/${item.id}`}>
                                    <div>
                                        <img
                                            src={item.album.images[0]?.url || 'placeholder-image-url'}
                                            alt={item.name}
                                            className="item-image"
                                        />
                                    </div>
                                    <div className="item-list">
                                        <h2>{item.name}</h2>
                                        <p>
                                            <strong>Artista:</strong> {item.artists.map(artist => artist.name).join(', ')}
                                        </p>
                                        <p><strong>Álbum:</strong> {item.album.name}</p>
                                        <p><strong>Fecha de Lanzamiento:</strong> {item.album.release_date}</p>
                                        <p><strong>Popularidad:</strong> {item.popularity}</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="pagination-buttons">
                        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                            Previous
                        </button>
                        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemList;