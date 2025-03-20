"use client"

import { useState } from "react"
import axios from "axios"

const ReviewModal = ({ isOpen, onClose, service, onSuccess, onError }) => {
    const [reviewFormData, setReviewFormData] = useState({
        note: 5,
        commentaire: "",
    })

    if (!isOpen || !service) return null

    // Gérer les changements dans le formulaire de review
    const handleReviewFormChange = (e) => {
        const { name, value } = e.target
        setReviewFormData((prev) => ({
            ...prev,
            [name]: name === "note" ? Number.parseInt(value) : value,
        }))
    }

    // Soumettre la review
    const handleReviewSubmit = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem("token")
        if (!token) {
            onError("Veuillez vous connecter pour ajouter une review")
            return
        }

        try {
            const reviewData = {
                ...reviewFormData,
                serviceId: service.id,
            }

            const response = await axios.post("/api/reviews", reviewData, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (response.status === 200) {
                // Afficher un message de succès
                onSuccess("Review ajoutée avec succès !")

                // Fermer le modal et réinitialiser le formulaire
                onClose()
                setReviewFormData({
                    note: 5,
                    commentaire: "",
                })
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de la review:", error)
            onError(error.response?.data || "Erreur lors de l'ajout de la review")
        }
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Ajouter un avis pour: {service.nom}</h3>
                            <button
                                type="button"
                                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                onClick={onClose}
                            >
                                <span className="sr-only">Fermer</span>
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                                    Note (sur 5)
                                </label>
                                <div className="mt-2 flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewFormData((prev) => ({ ...prev, note: star }))}
                                            className="focus:outline-none"
                                        >
                                            <svg
                                                className={`h-8 w-8 ${star <= reviewFormData.note ? "text-yellow-400" : "text-gray-300"}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                    <span className="ml-2 text-gray-600">{reviewFormData.note}/5</span>
                                </div>
                                <input type="hidden" name="note" value={reviewFormData.note} />
                            </div>

                            <div>
                                <label htmlFor="commentaire" className="block text-sm font-medium text-gray-700">
                                    Commentaire
                                </label>
                                <textarea
                                    name="commentaire"
                                    id="commentaire"
                                    rows={4}
                                    value={reviewFormData.commentaire}
                                    onChange={handleReviewFormChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Partagez votre expérience avec ce service..."
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Soumettre
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewModal

