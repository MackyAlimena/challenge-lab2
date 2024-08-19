import React, { useState } from 'react';
import { fetchFilteredSpotifyItems } from '../../api/ApiFilter';
import { SpotifyItem } from '../../types/spotifyTypes'; // Adjust the path as needed
import './SearchAndFilter.css';

interface SearchAndFilterProps {
    onSearch: (items: SpotifyItem[]) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ onSearch }) => {
    const [query, setQuery] = useState<string>('');
    const [popularityMin, setPopularityMin] = useState<string>('');
    const [popularityMax, setPopularityMax] = useState<string>('');
    const [releaseDateStart, setReleaseDateStart] = useState<string>('');
    const [releaseDateEnd, setReleaseDateEnd] = useState<string>(new Date().toISOString().split('T')[0]);
    const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
    const [isPopularityPopupVisible, setIsPopularityPopupVisible] = useState<boolean>(false);
    const [isReleaseDatePopupVisible, setIsReleaseDatePopupVisible] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [originalItems, setOriginalItems] = useState<SpotifyItem[]>([]); // New state variable

    const handleSearch = async () => {
        try {
            const items = await fetchFilteredSpotifyItems(query, popularityMin, popularityMax, releaseDateStart, releaseDateEnd);
            if (items.length === 0) {
                setErrorMessage('There are no results.');
            } else {
                setOriginalItems(items); // Store the fetched items
                onSearch(items);
                setIsPopupVisible(false);
                setErrorMessage('');
            }
        } catch (error) {
            console.error('Error searching:', error);
            setErrorMessage('Error searching for items.');
        }
    };

    const handleApplyPopularity = () => {
        const min = parseInt(popularityMin, 10);
        const max = parseInt(popularityMax, 10);

        if ((min < 0 || min > 100) || (max < 0 || max > 100)) {
            setErrorMessage('La popularidad debe estar entre 0 y 100.');
        } else {
            setErrorMessage('');
            setIsPopularityPopupVisible(false);
        }
    };

    const handleApplyReleaseDate = () => {
        setIsReleaseDatePopupVisible(false);
    };

    const handleResetFilters = () => {
        setQuery('');
        setPopularityMin('');
        setPopularityMax('');
        setReleaseDateStart('');
        setReleaseDateEnd(new Date().toISOString().split('T')[0]);
        setErrorMessage('');
        setIsPopupVisible(false);
        setIsPopularityPopupVisible(false);
        setIsReleaseDatePopupVisible(false);
        onSearch(originalItems); // Use the original list of items
        window.location.reload(); // Refresh the page
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
                            <button onClick={() => setIsPopularityPopupVisible(true)}>Filtrar por Popularidad</button>
                            <button onClick={() => setIsReleaseDatePopupVisible(true)}>Filtrar por Fecha de Lanzamiento</button>
                            <button onClick={handleSearch}>Buscar</button>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                        </div>
                    </div>
                </div>
            )}
            {isPopularityPopupVisible && (
                <div className="popup-container">
                    <div className="popup-content">
                        <button className="close-button" onClick={() => setIsPopularityPopupVisible(false)}>X</button>
                        <div className="search-filter-container">
                            <input
                                type="number"
                                value={popularityMin}
                                onChange={(e) => setPopularityMin(e.target.value)}
                                placeholder="Popularidad mínima..."
                            />
                            <input
                                type="number"
                                value={popularityMax}
                                onChange={(e) => setPopularityMax(e.target.value)}
                                placeholder="Popularidad máxima..."
                            />
                            <button onClick={handleApplyPopularity}>Aplicar</button>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                        </div>
                    </div>
                </div>
            )}
            {isReleaseDatePopupVisible && (
                <div className="popup-container">
                    <div className="popup-content">
                        <button className="close-button" onClick={() => setIsReleaseDatePopupVisible(false)}>X</button>
                        <div className="search-filter-container">
                            <input
                                type="date"
                                value={releaseDateStart}
                                onChange={(e) => setReleaseDateStart(e.target.value)}
                                placeholder="Fecha de lanzamiento desde..."
                            />
                            <input
                                type="date"
                                value={releaseDateEnd}
                                onChange={(e) => setReleaseDateEnd(e.target.value)}
                                placeholder="Fecha de lanzamiento hasta..."
                            />
                            <button onClick={handleApplyReleaseDate}>Aplicar</button>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={handleResetFilters}>Eliminar Filtros</button>
        </div>
    );
};

export default SearchAndFilter;