"use client"

import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { useEffect, useState } from "react"

import LandingPage from "../pages/LandingPage.jsx"
import LoginPage from "../pages/LoginPage.jsx"
import RegisterPage from "../pages/RegisterPage.jsx"
import Services from "../pages/Services.jsx"
import ServiceDetail from "../pages/ServiceDetail.jsx"
import UserReservations from "../pages/UserReservations.jsx"
import ProviderStats from "../pages/ProviderStats.jsx"
import ProviderServices from "../pages/ProviderServices.jsx"
import AddService from "../pages/AddService.jsx"
import AboutUs from "../pages/about-us.jsx"
import NotFoundPage from "../pages/NotFoundPage.jsx"
import Payment from "../pages/Payment.jsx"


import Layout from "../components/layout.jsx"

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        setIsAuthenticated(!!token)
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

const AuthRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        console.log("AuthRoute - Token trouvé:", !!token) // Log pour débogage
        setIsAuthenticated(!!token)
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        )
    }

    if (isAuthenticated) {
        console.log("AuthRoute - Redirection vers l'accueil")
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

const ProviderRoute = () => {
    const [isProvider, setIsProvider] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const role = localStorage.getItem("role")

        setIsProvider(!!token && role === "PROVIDER")
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        )
    }

    if (!isProvider) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<LandingPage />} />

                    <Route path="/about-us" element={<AboutUs />} />

                    <Route element={<AuthRoute />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    <Route element={<ProtectedRoute />}>
                        <Route path="/services" element={<Services />} />
                        <Route path="/services/:id" element={<ServiceDetail />} />
                        <Route path="/reservations" element={<UserReservations />} />
                        <Route path="/payment" element={<Payment />} />

                        <Route element={<ProviderRoute />}>
                            <Route path="/provider/stats" element={<ProviderStats />} />
                            <Route path="/provider/services" element={<ProviderServices />} />
                            <Route path="/provider/add-service" element={<AddService />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes

