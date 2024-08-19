import React, { useState } from 'react';
import { fetchFilteredSpotifyItems } from '../../api/ApiFilter';
import { SpotifyItem } from '../../types/spotifyTypes'; // Adjust the path as needed
import './SearchAndFilter.css';

interface SearchAndFilterProps {
    onSearch: (items: SpotifyItem[]) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ onSearch }) => {
    const [query, setQuery] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [releaseDate, setReleaseDate] = useState<string>('');
    const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);

    const handleSearch = async () => {
        try {
            const items = await fetchFilteredSpotifyItems( query, genre, releaseDate );
            onSearch(items);
            setIsPopupVisible(false);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    return (
        <div>
            <button onClick={() => setIsPopupVisible(true)}>Buscar</button>
            {isPopupVisible && (
                <div className="popup-container">
                    <div className="popup-content">
                        <button className="close-button" onClick={() => setIsPopupVisible(false)}>X</button>
                        <div className="search-filter-container">
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchAndFilter;