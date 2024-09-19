import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RegisterPage from './../Pages/RegisterPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/dang-ky" element={<RegisterPage />} />
        </Routes>
    );
};

export default AppRoutes;