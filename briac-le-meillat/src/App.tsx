import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import LandingPage from './Pages/LandingPage';
import Subscribe from './Pages/Subscribe';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Doctor from './Pages/Doctor';
import Nurse from './Pages/Nurse';
import Patient from './Pages/Patient';
import Pharmacist from './Pages/Pharmacist';
import Devop from './Pages/Devop';
import LoginCustom from './Pages/LoginCustom';

import { ThemeProvider } from './Contexts/ThemeProvider';
import { ProjectProvider } from './Contexts/ProjectContext';

function App() {
    return (
        <ThemeProvider>
            <ProjectProvider>
                <HeroUIProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/subscribe" element={<Subscribe />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/custom-login" element={<Login />} />
                            <Route path="/connexion" element={<LoginCustom />} />

                            <Route path="/doctor" element={<Doctor />} />
                            <Route path="/nurse" element={<Nurse />} />
                            <Route path="/patient" element={<Patient />} />
                            <Route path="/pharmacist" element={<Pharmacist />} />
                            <Route path="/devop" element={<Devop />} />
                        </Routes>
                    </BrowserRouter>
                </HeroUIProvider>
            </ProjectProvider>
        </ThemeProvider>
    );
}

export default App;
