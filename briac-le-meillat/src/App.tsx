import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Providers } from './Providers';
import { CryptoModal } from './Contexts/CryptoContext';

import LandingPage from './Pages/LandingPage';
import Subscribe from './Pages/Subscribe';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Devop from './Pages/Devop';
import LoginCustom from './Pages/LoginCustom';
import SignInSide from './Pages/SignInSide';
import Research from './Pages/Research';
import OptimisationNeurones from './Pages/Researches/OptimisationNeurones';
import CVPage from './Pages/CVPage';
import Contact from './Pages/Contact';
import ProjectDetails from './Pages/ProjectDetails';
import RealisationsAdmin from './Pages/Admin/RealisationsAdmin';
import TextesAdmin from './Pages/Admin/TextesAdmin';
import AdminPanel from './Components/AdminPanel';

const BerangerePage = React.lazy(() => import('./Pages/BerangerePage').catch(() => ({ default: () => <div className="p-10 text-white text-center">Fichier introuvable sur cette machine. Clonez BerangerePage.tsx !</div> })));
const EpisodePage = React.lazy(() => import('./Pages/EpisodePage').catch(() => ({ default: () => <div className="p-10 text-white text-center">Fichier introuvable sur cette machine. Clonez EpisodePage.tsx !</div> })));

function App() {
    return (
        <Providers>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/subscribe" element={<Subscribe />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/custom-login" element={<Login />} />
                    <Route path="/connexion" element={<LoginCustom />} />
                    <Route path="/login" element={<SignInSide />} />

                    <Route path="/recherches" element={<Research />} />
                    <Route path="/recherches/optimisation-neurones" element={<OptimisationNeurones />} />

                    <Route path="/devop" element={<Devop />} />
                    <Route path="/cv" element={<CVPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    
                    {/* Bérangère routes - Protégées par chiffrement */}
                    <Route path="/berangere" element={
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <BerangerePage />
                        </React.Suspense>
                    } />
                    <Route path="/berangere/serie/:id" element={
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <EpisodePage />
                        </React.Suspense>
                    } />
                    
                    {/* Routes admin et réalisations - Actives en DEV uniquement */}
                    {import.meta.env.DEV && (
                        <>
                            <Route path="/realisations/:id" element={<ProjectDetails />} />
                            <Route path="/admin/realisations" element={<RealisationsAdmin />} />
                            <Route path="/admin/textes" element={<TextesAdmin />} />
                        </>
                    )}
                </Routes>
                
                {/* Modal de déchiffrement pour les routes Bérangère */}
                <CryptoModal />
            </BrowserRouter>
        </Providers>
    );
}

export default App;
