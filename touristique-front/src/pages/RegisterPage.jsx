"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import RegisterForm from "../components/Auth/RegisterForm"

const RegisterPage = () => {
    const navigate = useNavigate()

    useEffect(() => {
        // Vérification directe dans la page d'inscription
        const token = localStorage.getItem("token")
        if (token) {
            console.log("RegisterPage - Utilisateur déjà connecté, redirection")
            navigate("/", { replace: true })
        }
    }, [navigate])

    return (
        <div className="min-h-screen">
            <RegisterForm />
        </div>
    )
}

export default RegisterPage

