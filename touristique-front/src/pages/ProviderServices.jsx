"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const ProviderServices = () => {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchServices = async () => {
            const token = localStorage.getItem("token")
            const role = localStorage.getItem("role")

            if (!token || role !== "PROVIDER") {
                navigate("/login")
                return
            }

            try {
                const response = await axios.get("/api/services/provider", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setServices(response.data)
            } catch (err) {
                setError("Erreur lors de la récupération des services.")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchServices()
    }, [navigate])

    if (loading) return <div>Chargement...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="container mx-auto p-4 mt-20">
            <h1 className="text-2xl font-bold mb-4">Mes Services</h1>
            {services.length === 0 ? (
                <p>Aucun service trouvé.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white rounded-lg shadow-md p-4">
                            <h2 className="text-xl font-semibold">{service.nom}</h2>
                            <p className="text-gray-600">{service.description}</p>
                            <p className="text-lg font-medium text-blue-600">{service.prix} MAD</p>
                            <p className={`text-sm ${service.disponibilite ? "text-green-600" : "text-red-600"}`}>
                                {service.disponibilite ? "Disponible" : "Non disponible"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProviderServices