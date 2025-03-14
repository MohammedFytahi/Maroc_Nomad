import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservations = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("/api/reservations/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Response received:", response.status);
                // The response is an array but has circular references
                // Just set it directly without trying to process it
                setReservations(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des réservations:", error);
                setError("Une erreur est survenue lors de la récupération des réservations.");
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [navigate]);

    const formatDate = (dateString) => {
        if (!dateString) return "Date non disponible";
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const translateStatus = (status) => {
        const statusMap = {
            "EN_ATTENTE_PAIEMENT": "En attente de paiement",
            "CONFIRMEE": "Confirmée",
            "ANNULEE": "Annulée",
            "COMPLETE": "Complétée"
        };
        return statusMap[status] || status;
    };

    const handleCancellation = async (reservationId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/api/reservations/${reservationId}/annuler`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Remove the cancelled reservation from the list
            setReservations(prev => prev.filter(res => res.id !== reservationId));
        } catch (error) {
            console.error("Erreur lors de l'annulation:", error);
            setError("Échec de l'annulation. Veuillez réessayer.");
            // Clear the error after 3 seconds
            setTimeout(() => setError(null), 3000);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2">Chargement en cours...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Erreur!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Mes Réservations</h1>

            {!Array.isArray(reservations) || reservations.length === 0 ? (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                    <p>Vous n'avez aucune réservation pour le moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reservations.map((reservation) => (
                        <div key={reservation?.id || Math.random()} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-blue-600 text-white px-4 py-2">
                                <h2 className="text-xl font-semibold">
                                    {reservation?.service?.nom || "Service sans nom"}
                                </h2>
                            </div>

                            <div className="p-4">
                                <p className="text-gray-600 mb-3">
                                    {reservation?.service?.description || "Aucune description disponible"}
                                </p>

                                <div className="border-t border-gray-200 pt-3">
                                    <p className="mb-2">
                                        <span className="font-medium">Date de réservation:</span>{" "}
                                        {formatDate(reservation?.dateReservation)}
                                    </p>

                                    <p className="mb-2">
                                        <span className="font-medium">Statut:</span>{" "}
                                        <span className={`inline-block px-2 py-1 text-sm rounded ${
                                            reservation?.statut === "CONFIRMEE" ? "bg-green-100 text-green-800" :
                                                reservation?.statut === "EN_ATTENTE_PAIEMENT" ? "bg-yellow-100 text-yellow-800" :
                                                    reservation?.statut === "ANNULEE" ? "bg-red-100 text-red-800" :
                                                        "bg-gray-100 text-gray-800"
                                        }`}>
                                            {translateStatus(reservation?.statut) || "Non spécifié"}
                                        </span>
                                    </p>

                                    <p className="mb-3">
                                        <span className="font-medium">Prix:</span>{" "}
                                        <span className="text-lg font-semibold text-blue-600">
                                            {reservation?.service?.prix ? `${reservation.service.prix} MAD` : "Prix non disponible"}
                                        </span>
                                    </p>

                                    {reservation?.statut !== "ANNULEE" && reservation?.statut !== "COMPLETE" && (
                                        <button
                                            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-300 w-full text-center"
                                            onClick={() => handleCancellation(reservation.id)}
                                        >
                                            Annuler la réservation
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserReservations;