import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Header from './Header';
import HomePage from './HomePage';

export default function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
            {/*<Footer />*/}
        </Router>
    );
}
