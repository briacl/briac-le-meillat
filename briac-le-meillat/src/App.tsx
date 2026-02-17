import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

import { ThemeProvider } from './Contexts/ThemeProvider';
import { ProjectProvider } from './Contexts/ProjectContext';
import { AuthProvider } from './Contexts/AuthContext';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ProjectProvider>
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
                            </Routes>
                        </BrowserRouter>
                    </HeroUIProvider>
                </ProjectProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
