import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Styles/index.css';
import Header from './Components/Header.jsx';
import HomePage from './Pages/HomePage.jsx';

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
