"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/layout"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import AddService from "./pages/AddService"
import Services from "./pages/Services"
import Payment from "./pages/Payment"
import ProviderServices from "./pages/ProviderServices"
import UserReservations from "./pages/UserReservations"
import setupAxiosInterceptors from "./utils/axiosSetup"
import AboutUs from "./pages/about-us.jsx";

const App = () => {
    useEffect(() => {
        // Set up axios interceptors
        setupAxiosInterceptors()

        // Log initial auth state
        const token = localStorage.getItem("token")
        const role = localStorage.getItem("role")
        console.log("Current auth state:", {
            isAuthenticated: !!token,
            role: role,
        })
    }, [])

    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/provider/add-service" element={<AddService />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/reservations" element={<UserReservations />} />
                    <Route path="/about" element={<AboutUs/>}/>
                    <Route path="/provider/services" element={<ProviderServices />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App

