"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const UserReservations = () => {
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchReservations = async () => {
            const token = localStorage.getItem("token")

            if (!token) {
                navigate("/login")
                return
            }

            try {
                const response = await axios.get("/api/reservations/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                console.log("Response received:", response.status, response.data)
                setReservations(response.data)
            } catch (error) {
                console.error("Erreur lors de la récupération des réservations:", error)
                setError("Une erreur est survenue lors de la récupération des réservations.")
            } finally {
                setLoading(false)
            }
        }

        fetchReservations()
    }, [navigate])

    const formatDate = (dateString) => {
        if (!dateString) return "Date non disponible"
        const date = new Date(dateString)
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const translateStatus = (status) => {
        const statusMap = {
            EN_ATTENTE_PAIEMENT: "En attente de paiement",
            CONFIRMEE: "Confirmée",
            ANNULEE: "Annulée",
            COMPLETE: "Complétée",
        }
        return statusMap[status] || status
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "CONFIRMEE":
                return "bg-green-100 text-green-800 border-green-200"
            case "EN_ATTENTE_PAIEMENT":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "ANNULEE":
                return "bg-red-100 text-red-800 border-red-200"
            case "COMPLETE":
                return "bg-blue-100 text-blue-800 border-blue-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "CONFIRMEE":
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                )
            case "EN_ATTENTE_PAIEMENT":
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                        />
                    </svg>
                )
            case "ANNULEE":
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                )
            case "COMPLETE":
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                )
            default:
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                        />
                    </svg>
                )
        }
    }

    const handleCancellation = async (reservationId) => {
        try {
            const token = localStorage.getItem("token")
            await axios.delete(`/api/reservations/${reservationId}/annuler`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            setReservations((prev) => prev.filter((res) => res.id !== reservationId))
            setSuccessMessage("Réservation annulée avec succès")
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (error) {
            console.error("Erreur lors de l'annulation:", error)
            setError("Échec de l'annulation. Veuillez réessayer.")
            setTimeout(() => setError(null), 3000)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                            <p className="mt-4 text-lg text-gray-700">Chargement de vos réservations...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* En-tête */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Réservations</h1>
                    <p className="text-gray-600">Consultez et gérez toutes vos réservations de services</p>
                </div>

                {/* Messages de notification */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm">
                        <div className="flex items-center">
                            <svg
                                className="h-5 w-5 text-red-500 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-sm">
                        <div className="flex items-center">
                            <svg
                                className="h-5 w-5 text-green-500 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>{successMessage}</span>
                        </div>
                    </div>
                )}

                {/* Contenu principal */}
                {!Array.isArray(reservations) || reservations.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <svg
                            className="h-16 w-16 text-gray-400 mx-auto mb-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune réservation trouvée</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            Vous n'avez aucune réservation pour le moment. Explorez nos services disponibles pour commencer votre
                            voyage.
                        </p>
                        <button
                            onClick={() => navigate("/services")}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Découvrir les services
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reservations.map((reservation) => (
                            <div
                                key={reservation?.id || Math.random()}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                            >
                                {/* En-tête de la carte */}
                                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-4">
                                    <h2 className="text-xl font-bold truncate">{reservation?.serviceNom || "Service sans nom"}</h2>
                                    <p className="text-indigo-100 text-sm mt-1">Réservé le {formatDate(reservation?.dateReservation)}</p>
                                </div>

                                {/* Corps de la carte */}
                                <div className="p-6 flex-grow flex flex-col">
                                    {/* Statut */}
                                    <div className="flex items-center mb-4">
                                        <div className="mr-3">{getStatusIcon(reservation?.statut)}</div>
                                        <div>
                                            <span className="text-sm text-gray-500">Statut</span>
                                            <div
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium border ${getStatusColor(reservation?.statut)} ml-2`}
                                            >
                                                {translateStatus(reservation?.statut) || "Non spécifié"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Détails */}
                                    <div className="space-y-3 mb-6 flex-grow">
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                            <span className="text-gray-600">Prix</span>
                                            <span className="text-xl font-bold text-indigo-600">
                        {reservation?.servicePrix ? `${reservation.servicePrix} MAD` : "Prix non disponible"}
                      </span>
                                        </div>

                                        {reservation?.serviceType && (
                                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                                <span className="text-gray-600">Type de service</span>
                                                <span className="text-gray-800 font-medium">{reservation.serviceType}</span>
                                            </div>
                                        )}

                                        {reservation?.serviceDate && (
                                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                                <span className="text-gray-600">Date du service</span>
                                                <span className="text-gray-800 font-medium">{formatDate(reservation.serviceDate)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-auto">
                                        {reservation?.statut !== "ANNULEE" && reservation?.statut !== "COMPLETE" ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    className="bg-white border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition duration-300 font-medium"
                                                    onClick={() => navigate(`/services/${reservation.serviceId}`)}
                                                >
                                                    Voir détails
                                                </button>
                                                <button
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300 font-medium"
                                                    onClick={() => handleCancellation(reservation.id)}
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-300 font-medium"
                                                onClick={() => navigate(`/services/${reservation.serviceId}`)}
                                            >
                                                Voir détails
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserReservations

