import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
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
import Realisations from './Pages/Realisations';
import ProjectDetails from './Pages/ProjectDetails';
import RealisationsAdmin from './Pages/Admin/RealisationsAdmin';

import { ThemeProvider } from './Contexts/ThemeProvider';
import { AuthProvider } from './Contexts/AuthContext';
import { ProjectProvider } from './Contexts/ProjectContext';
import { WebProjectProvider } from './Contexts/WebProjectContext';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ProjectProvider>
                    <WebProjectProvider>
                        <HeroUIProvider>
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
                                    <Route path="/realisations" element={<Navigate to="/recherches?tab=realisations" replace />} />
                                    <Route path="/realisations/:id" element={<ProjectDetails />} />
                                    <Route path="/admin/realisations" element={<RealisationsAdmin />} />
                                </Routes>
                            </BrowserRouter>
                        </HeroUIProvider>
                    </WebProjectProvider>
                </ProjectProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
