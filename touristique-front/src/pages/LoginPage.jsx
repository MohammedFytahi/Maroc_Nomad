"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LoginForm from "../components/Auth/LoginForm"

const LoginPage = () => {
    const navigate = useNavigate()

    useEffect(() => {
        // Vérification directe dans la page de connexion
        const token = localStorage.getItem("token")
        if (token) {
            console.log("LoginPage - Utilisateur déjà connecté, redirection")
            navigate("/", { replace: true })
        }
    }, [navigate])

    return (
        <div className="min-h-screen">
            <LoginForm />
        </div>
    )
}

export default LoginPage

