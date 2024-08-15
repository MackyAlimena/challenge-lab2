import React from 'react';
import 'dotenv';
import { Routes, Route } from 'react-router-dom';
import ItemList from './components/ItemList';
import ItemDetails from './components/ItemDetails';
import GridView from './components/GridView';
import './styles/global.css';
require('dotenv').config();

const App: React.FC = () => {
    return (
        <div className="app-container">
            <header>
                <h1>Spotify Visualizer</h1>
                <h2>Here are the Top Hits</h2>
            </header>
            <Routes>
                <Route path="/" element={<ItemList />} />
                <Route path="/details/:id" element={<ItemDetails />} />
                <Route path="/grid" element={<GridView />} />
            </Routes>
        </div>
    );
};

export default App;