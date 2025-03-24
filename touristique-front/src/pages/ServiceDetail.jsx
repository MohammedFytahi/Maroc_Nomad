"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import ReviewModal from "../components/ReviewModal.jsx"

const ServiceDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [service, setService] = useState(null)
    const [reviews, setReviews] = useState([])
    const [reviewCount, setReviewCount] = useState(0)
    const [averageRating, setAverageRating] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState("")
    const [serviceToReview, setServiceToReview] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem("token")
            const role = localStorage.getItem("role")

            if (token) {
                try {
                    const response = await axios.get("/api/auth/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    setCurrentUser(response.data)
                } catch (error) {
                    console.error("Erreur lors de la récupération des informations utilisateur:", error)
                    if (role) {
                        setCurrentUser({ role: role })
                    }
                }
            } else if (role) {
                setCurrentUser({ role: role })
            }
        }

        fetchCurrentUser()
    }, [])

    useEffect(() => {
        const fetchServiceAndReviews = async () => {
            setIsLoading(true)
            const token = localStorage.getItem("token")

            if (!token) {
                navigate("/login")
                return
            }

            try {
                // Récupérer les détails du service
                const serviceResponse = await axios.get(`/api/services/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setService(serviceResponse.data.service) // Adjusted to match the response format

                // Récupérer les avis du service
                const reviewsResponse = await axios.get(`/api/reviews/service/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setReviews(reviewsResponse.data.reviews || [])
                setReviewCount(reviewsResponse.data.reviewCount || 0)
                setAverageRating(reviewsResponse.data.averageRating || 0)
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error)
                setError("Erreur lors de la récupération des données. Veuillez réessayer.")
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            fetchServiceAndReviews()
        }
    }, [id, navigate])

    const handleImageError = (e) => {
        e.target.src = "/placeholder.svg?height=300&width=500"
        e.target.alt = "Image non disponible"
    }

    const handleReservation = async (serviceId, amount) => {
        const token = localStorage.getItem("token")

        if (!token) {
            setError("Veuillez vous connecter pour réserver un service")
            navigate("/login")
            return
        }

        try {
            const reservationResponse = await axios.post(
                `/api/reservations/reserver/${serviceId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )

            if (reservationResponse.status === 200) {
                const reservationId = reservationResponse.data.id
                setSuccessMessage("Réservation créée avec succès ! Redirection vers le paiement...")

                setTimeout(() => {
                    navigate("/payment", { state: { reservationId, amount } })
                }, 1500)
            }
        } catch (error) {
            console.error("Erreur lors de la réservation:", error)
            setError(error.response?.data?.message || "Erreur lors de la réservation")
        }
    }

    const openReviewModal = () => {
        setServiceToReview(service)
    }

    const getServiceTypeLabel = (service) => {
        if (!service) return "Autre"
        if (service.type && service.date) return "Transport"
        if (service.menu) return "Restauration"
        if (service.horaires) return "Hébergement"
        return "Autre"
    }

    const getServiceTypeColor = (type) => {
        switch (type) {
            case "Transport":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "Restauration":
                return "bg-green-100 text-green-800 border-green-200"
            case "Hébergement":
                return "bg-purple-100 text-purple-800 border-purple-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const renderServiceDetails = () => {
        if (!service) return null

        if (service.type && service.date) {
            return (
                <div className="space-y-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Date</p>
                            <p className="text-base text-gray-900">
                                {new Date(service.date).toLocaleDateString("fr-FR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Durée</p>
                            <p className="text-base text-gray-900">{service.duration} minutes</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Type</p>
                            <p className="text-base text-gray-900">{service.type}</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Départ</p>
                            <p className="text-base text-gray-900">{service.depart}</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Destination</p>
                            <p className="text-base text-gray-900">{service.destination}</p>
                        </div>
                    </div>
                </div>
            )
        } else if (service.menu) {
            return (
                <div className="space-y-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Menu</p>
                            <ul className="mt-2 text-base text-gray-900 space-y-1">
                                {service.menu &&
                                    service.menu.map((item, idx) => (
                                        <li key={idx} className="flex items-center">
                                            <svg
                                                className="h-4 w-4 text-green-500 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>

                    {service.optionRegime && service.optionRegime.length > 0 && (
                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Options de régime</p>
                                <ul className="mt-2 text-base text-gray-900 space-y-1">
                                    {service.optionRegime.map((option, idx) => (
                                        <li key={idx} className="flex items-center">
                                            <svg
                                                className="h-4 w-4 text-green-500 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Adresse</p>
                            <p className="text-base text-gray-900">{service.adresse}</p>
                        </div>
                    </div>
                </div>
            )
        } else if (service.horaires) {
            return (
                <div className="space-y-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-purple-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Type</p>
                            <p className="text-base text-gray-900">{service.type}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-purple-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Horaires disponibles</p>
                            <ul className="mt-2 text-base text-gray-900 space-y-1">
                                {service.horaires &&
                                    service.horaires.map((horaire, idx) => (
                                        <li key={idx} className="flex items-center">
                                            <svg
                                                className="h-4 w-4 text-purple-500 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {new Date(horaire).toLocaleString("fr-FR")}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-purple-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Adresse</p>
                            <p className="text-base text-gray-900">{service.adresse}</p>
                        </div>
                    </div>
                </div>
            )
        }
        return null
    }

    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-700">Chargement des détails du service...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">
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
                    <div className="mt-6 text-center">
                        <Link
                            to="/services"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Retour aux services
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if (!service) {
        return (
            <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50">
                <div className="max-w-7xl mx-auto">
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Service non trouvé</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            Le service que vous recherchez n'existe pas ou a été supprimé.
                        </p>
                        <Link
                            to="/services"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Retour aux services
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const serviceType = getServiceTypeLabel(service)

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Messages de notification */}
                {successMessage && (
                    <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm">
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

                {/* Fil d'Ariane */}
                <nav className="mb-6">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li>
                            <Link to="/" className="hover:text-indigo-600">
                                Accueil
                            </Link>
                        </li>
                        <li>
                            <span className="mx-2">/</span>
                        </li>
                        <li>
                            <Link to="/services" className="hover:text-indigo-600">
                                Services
                            </Link>
                        </li>
                        <li>
                            <span className="mx-2">/</span>
                        </li>
                        <li className="text-indigo-600 font-medium truncate">{service.nom}</li>
                    </ol>
                </nav>

                {/* Contenu principal */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* En-tête avec image */}
                    <div className="relative h-80 md:h-96">
                        <img
                            src={
                                service.imageUrl ? `http://localhost:8081${service.imageUrl}` : "/placeholder.svg?height=600&width=1200"
                            }
                            alt={service.nom || "Service"}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                        />
                        <div className="absolute top-4 right-4">
              <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${getServiceTypeColor(serviceType)}`}
              >
                {serviceType}
              </span>
                        </div>
                        {service.disponibilite === false && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl transform rotate-12">
                                    Non disponible
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contenu du service */}
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="mb-6 md:mb-0 md:pr-8 md:w-2/3">
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.nom}</h1>

                                <div className="flex items-center mb-6">
                                    <div className="flex items-center">
                                        {renderStars(averageRating)}
                                        <span className="ml-2 text-lg font-medium text-gray-700">
                      {averageRating > 0 ? averageRating.toFixed(1) : "Pas encore d'avis"}
                    </span>
                                    </div>
                                    <span className="mx-2 text-gray-400">•</span>
                                    <span className="text-gray-600">{reviewCount} avis</span>
                                </div>

                                <div className="prose prose-indigo max-w-none mb-8">
                                    <p className="text-gray-700 text-lg">{service.description}</p>
                                </div>

                                {renderServiceDetails()}
                            </div>

                            <div className="md:w-1/3 bg-gray-50 rounded-lg p-6">
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Prix</span>
                                        <span className="text-3xl font-bold text-indigo-600">{service.prix} MAD</span>
                                    </div>
                                    <div className="h-px bg-gray-200 my-4"></div>
                                    <div className="flex items-center mb-4">
                                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-700">Réservation instantanée</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            />
                                        </svg>
                                        <span className="text-gray-700">Paiement sécurisé</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => handleReservation(service.id, service.prix)}
                                        disabled={!service.disponibilite}
                                        className={`w-full py-3 px-4 rounded-lg font-medium text-white text-center ${
                                            service.disponibilite
                                                ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                    >
                                        {service.disponibilite ? "Réserver maintenant" : "Non disponible"}
                                    </button>

                                    <button
                                        onClick={openReviewModal}
                                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-center"
                                    >
                                        Ajouter un avis
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section des avis */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Avis des clients
                        <span className="ml-2 text-lg font-normal text-gray-600">({reviewCount})</span>
                    </h2>

                    {reviews.length === 0 ? (
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
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                            </svg>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun avis pour le moment</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">
                                Soyez le premier à donner votre avis sur ce service !
                            </p>
                            <button
                                onClick={openReviewModal}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Ajouter un avis
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
                                                {review.userName ? review.userName.charAt(0).toUpperCase() : "U"}
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-medium text-gray-900">{review.userName || "Utilisateur"}</h3>
                                                {/* Note: ReviewDTO does not have a 'date' field; you may need to add it */}
                                                {/* <p className="text-sm text-gray-500">
                                                    {new Date(review.date).toLocaleDateString("fr-FR", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </p> */}
                                            </div>
                                            <div className="mt-1">{renderStars(review.note)}</div>
                                            <div className="mt-3 text-gray-700">
                                                <p>{review.commentaire}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ReviewModal
                isOpen={serviceToReview !== null}
                onClose={() => setServiceToReview(null)}
                service={serviceToReview}
                onSuccess={(message) => {
                    setSuccessMessage(message)
                    // Recharger les avis après l'ajout d'un nouvel avis
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500)
                }}
                onError={(message) => {
                    setError(message)
                    setTimeout(() => setError(null), 3000)
                }}
            />
        </div>
    )
}

export default ServiceDetail