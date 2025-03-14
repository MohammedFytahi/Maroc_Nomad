"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"

const stripePromise = loadStripe(
    "pk_test_51R0VanG74ISEt2F7nAAM2b9UXZoL7XEe0GAY3t57CbDrTIs1vaDeJp8ZdSwfvBu9kbtDZkEQBNpTDGjBlYT2xSUy00tkpjMPRA",
)

// Styles avancés pour l'élément de carte
const cardElementOptions = {
    style: {
        base: {
            iconColor: "#5469d4",
            color: "#1a1f36",
            fontWeight: "500",
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
            fontSize: "16px",
            fontSmoothing: "antialiased",
            "::placeholder": {
                color: "#a0aec0",
            },
            ":-webkit-autofill": {
                color: "#1a1f36",
            },
        },
        invalid: {
            iconColor: "#e53e3e",
            color: "#e53e3e",
        },
    },
    hidePostalCode: true,
}

// Composant pour l'animation de chargement
const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
        <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
        </div>
        <style jsx>{`
      .spinner {
        width: 24px;
        height: 24px;
        position: relative;
        margin-right: 12px;
      }
      .double-bounce1, .double-bounce2 {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: white;
        opacity: 0.6;
        position: absolute;
        top: 0;
        left: 0;
        animation: sk-bounce 2.0s infinite ease-in-out;
      }
      .double-bounce2 {
        animation-delay: -1.0s;
      }
      @keyframes sk-bounce {
        0%, 100% { transform: scale(0.0); }
        50% { transform: scale(1.0); }
      }
    `}</style>
    </div>
)

// Composant pour les méthodes de paiement
const PaymentMethodSelector = ({ selectedMethod, setSelectedMethod }) => {
    return (
        <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Méthode de paiement</h3>
            <div className="grid grid-cols-3 gap-3">
                <div
                    onClick={() => setSelectedMethod("card")}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedMethod === "card"
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                    }`}
                >
                    <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect
                            x="2"
                            y="5"
                            width="20"
                            height="14"
                            rx="2"
                            stroke={selectedMethod === "card" ? "#3b82f6" : "#6b7280"}
                            strokeWidth="2"
                        />
                        <path d="M2 10H22" stroke={selectedMethod === "card" ? "#3b82f6" : "#6b7280"} strokeWidth="2" />
                        <path
                            d="M6 15H10"
                            stroke={selectedMethod === "card" ? "#3b82f6" : "#6b7280"}
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className={`text-sm font-medium ${selectedMethod === "card" ? "text-blue-700" : "text-gray-700"}`}>
            Carte bancaire
          </span>
                </div>

                <div
                    onClick={() => setSelectedMethod("paypal")}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedMethod === "paypal"
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                    }`}
                >
                    <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M19.5 8.5C19.5 11.5 17 14 14 14H11L10 19H7L9.5 6H14C17 6 19.5 5.5 19.5 8.5Z"
                            stroke={selectedMethod === "paypal" ? "#3b82f6" : "#6b7280"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M16.5 13.5C16.5 16.5 14 19 11 19H8L7 24H4L6.5 11H11C14 11 16.5 10.5 16.5 13.5Z"
                            stroke={selectedMethod === "paypal" ? "#3b82f6" : "#6b7280"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className={`text-sm font-medium ${selectedMethod === "paypal" ? "text-blue-700" : "text-gray-700"}`}>
            PayPal
          </span>
                </div>

                <div
                    onClick={() => setSelectedMethod("applepay")}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedMethod === "applepay"
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                    }`}
                >
                    <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.5 5C11.5 5 10 5.5 9 6.5C8 7.5 7.5 9 7.5 10C7.5 11 8 12.5 9 13.5C10 14.5 11 15 12 15C13 15 14.5 14.5 15.5 13.5C16.5 12.5 17 11 17 10C17 9 16.5 7.5 15.5 6.5C14.5 5.5 13.5 5 12.5 5Z"
                            stroke={selectedMethod === "applepay" ? "#3b82f6" : "#6b7280"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M17 14L19 19"
                            stroke={selectedMethod === "applepay" ? "#3b82f6" : "#6b7280"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M7 14L5 19"
                            stroke={selectedMethod === "applepay" ? "#3b82f6" : "#6b7280"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className={`text-sm font-medium ${selectedMethod === "applepay" ? "text-blue-700" : "text-gray-700"}`}>
            Apple Pay
          </span>
                </div>
            </div>
        </div>
    )
}

// Composant pour le résumé de la commande
const OrderSummary = ({ reservationId, amount, details }) => {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white">Récapitulatif de la commande</h2>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">ID de réservation</span>
                    <span className="text-sm font-medium">{reservationId}</span>
                </div>

                {details.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.description}</p>
                            </div>
                        </div>
                        <span className="text-sm font-medium">{item.price} €</span>
                    </div>
                ))}

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Sous-total</span>
                        <span className="text-sm font-medium">{amount - 10} €</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Frais de service</span>
                        <span className="text-sm font-medium">10 €</span>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <span className="text-base font-semibold text-gray-800">Total</span>
                        <span className="text-lg font-bold text-blue-600">{amount} €</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Étapes du processus de paiement
const STEPS = {
    INFORMATION: "information",
    PAYMENT: "payment",
    CONFIRMATION: "confirmation",
}

// Composant principal du formulaire de paiement
const CheckoutForm = ({ reservationId, amount }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState("card")
    const [currentStep, setCurrentStep] = useState(STEPS.INFORMATION)
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        email: "",
        phone: "",
    })
    const navigate = useNavigate()

    // Données factices pour le résumé de la commande
    const orderDetails = [
        {
            name: "Réservation Premium",
            description: "Accès prioritaire inclus",
            price: amount - 30,
            icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
        },
        {
            name: "Assurance annulation",
            description: "Protection complète",
            price: 20,
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        },
        {
            name: "Service prioritaire",
            description: "Support dédié 24/7",
            price: 10,
            icon: "M13 10V3L4 14h7v7l9-11h-7z",
        },
    ]

    // Gestion des changements dans les champs du formulaire
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setCustomerInfo((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Validation du formulaire d'information
    const validateInformationForm = () => {
        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
            setError("Veuillez remplir tous les champs obligatoires")
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(customerInfo.email)) {
            setError("Veuillez entrer une adresse email valide")
            return false
        }

        setError(null)
        return true
    }

    // Passage à l'étape suivante
    const handleNextStep = () => {
        if (currentStep === STEPS.INFORMATION) {
            if (validateInformationForm()) {
                setCurrentStep(STEPS.PAYMENT)
            }
        }
    }

    // Retour à l'étape précédente
    const handlePreviousStep = () => {
        if (currentStep === STEPS.PAYMENT) {
            setCurrentStep(STEPS.INFORMATION)
        }
    }

    // Soumission du paiement
    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Étape 1 : Créer l'intention de paiement côté backend
            const response = await axios.post(
                `/api/payments/create-payment-intent/${reservationId}`,
                {
                    customerInfo,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                },
            )
            const { clientSecret } = response.data

            // Étape 2 : Confirmer le paiement avec Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: customerInfo.name,
                        email: customerInfo.email,
                        phone: customerInfo.phone,
                    },
                },
            })

            if (stripeError) {
                setError(stripeError.message)
                setLoading(false)
                return
            }

            if (paymentIntent.status === "succeeded") {
                // Étape 3 : Confirmer le paiement côté backend
                await axios.post(`/api/payments/confirm/${paymentIntent.id}`)
                setPaymentSuccess(true)
                setCurrentStep(STEPS.CONFIRMATION)
            }
        } catch (error) {
            console.error("Erreur lors du paiement :", error)
            setError("Une erreur est survenue lors du paiement. Veuillez réessayer.")
        } finally {
            setLoading(false)
        }
    }

    // Redirection après confirmation
    const handleFinish = () => {
        navigate("/reservations")
    }

    // Rendu conditionnel en fonction de l'étape
    const renderStepContent = () => {
        switch (currentStep) {
            case STEPS.INFORMATION:
                return (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nom complet <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={customerInfo.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Jean Dupont"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={customerInfo.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="jean.dupont@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Téléphone <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={customerInfo.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="+33 6 12 34 56 78"
                                required
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                            Continuer vers le paiement
                        </button>
                    </div>
                )

            case STEPS.PAYMENT:
                return (
                    <div className="space-y-6">
                        <PaymentMethodSelector selectedMethod={paymentMethod} setSelectedMethod={setPaymentMethod} />

                        {paymentMethod === "card" && (
                            <div>
                                <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
                                    Informations de carte
                                </label>
                                <div className="p-4 border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-sm">
                                    <CardElement id="card-element" options={cardElementOptions} />
                                </div>
                                <p className="mt-2 text-xs text-gray-500 flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-1 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                    Paiement sécurisé via Stripe. Vos données sont chiffrées.
                                </p>
                            </div>
                        )}

                        {paymentMethod !== "card" && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-yellow-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800">Mode de démonstration</h3>
                                        <div className="mt-2 text-sm text-yellow-700">
                                            <p>
                                                Le paiement par {paymentMethod === "paypal" ? "PayPal" : "Apple Pay"} n'est pas disponible dans
                                                cette démo. Veuillez utiliser le paiement par carte.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={handlePreviousStep}
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                            >
                                Retour
                            </button>

                            <button
                                type="submit"
                                disabled={!stripe || loading || paymentMethod !== "card"}
                                className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? (
                                    <>
                                        <LoadingSpinner />
                                        Traitement en cours...
                                    </>
                                ) : (
                                    `Payer ${amount} €`
                                )}
                            </button>
                        </div>
                    </div>
                )

            case STEPS.CONFIRMATION:
                return (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-10 h-10 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Paiement réussi !</h2>
                        <p className="text-gray-600 mb-8">
                            Votre réservation a été confirmée. Un email de confirmation a été envoyé à {customerInfo.email}.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Détails de la transaction</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">ID de réservation:</span>
                                    <span className="font-medium">{reservationId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Montant:</span>
                                    <span className="font-medium">{amount} €</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date:</span>
                                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Méthode:</span>
                                    <span className="font-medium">Carte bancaire</span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleFinish}
                            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                            Voir mes réservations
                        </button>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Indicateur d'étapes */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                currentStep === STEPS.INFORMATION || currentStep === STEPS.PAYMENT || currentStep === STEPS.CONFIRMATION
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-600"
                            }`}
                        >
                            1
                        </div>
                        <div
                            className={`ml-2 text-sm font-medium ${
                                currentStep === STEPS.INFORMATION || currentStep === STEPS.PAYMENT || currentStep === STEPS.CONFIRMATION
                                    ? "text-blue-600"
                                    : "text-gray-500"
                            }`}
                        >
                            Informations
                        </div>
                    </div>

                    <div
                        className={`flex-1 h-0.5 mx-4 ${
                            currentStep === STEPS.PAYMENT || currentStep === STEPS.CONFIRMATION ? "bg-blue-600" : "bg-gray-200"
                        }`}
                    ></div>

                    <div className="flex items-center">
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                currentStep === STEPS.PAYMENT || currentStep === STEPS.CONFIRMATION
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-600"
                            }`}
                        >
                            2
                        </div>
                        <div
                            className={`ml-2 text-sm font-medium ${
                                currentStep === STEPS.PAYMENT || currentStep === STEPS.CONFIRMATION ? "text-blue-600" : "text-gray-500"
                            }`}
                        >
                            Paiement
                        </div>
                    </div>

                    <div
                        className={`flex-1 h-0.5 mx-4 ${currentStep === STEPS.CONFIRMATION ? "bg-blue-600" : "bg-gray-200"}`}
                    ></div>

                    <div className="flex items-center">
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                currentStep === STEPS.CONFIRMATION ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                            }`}
                        >
                            3
                        </div>
                        <div
                            className={`ml-2 text-sm font-medium ${
                                currentStep === STEPS.CONFIRMATION ? "text-blue-600" : "text-gray-500"
                            }`}
                        >
                            Confirmation
                        </div>
                    </div>
                </div>
            </div>

            {/* Message d'erreur */}
            {error && (
                <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-red-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Contenu principal */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                    <h2 className="text-lg font-bold text-white">
                        {currentStep === STEPS.INFORMATION && "Vos informations"}
                        {currentStep === STEPS.PAYMENT && "Paiement sécurisé"}
                        {currentStep === STEPS.CONFIRMATION && "Confirmation"}
                    </h2>
                </div>

                <div className="p-6">{renderStepContent()}</div>
            </div>

            {/* Badges de sécurité */}
            {currentStep !== STEPS.CONFIRMATION && (
                <div className="flex items-center justify-center space-x-6 mt-8">
                    <div className="flex items-center">
                        <svg
                            className="w-8 h-8 text-gray-400 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path
                                d="M12 8H12.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-xs text-gray-500">Paiement sécurisé</span>
                    </div>

                    <div className="flex items-center">
                        <svg
                            className="w-8 h-8 text-gray-400 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9 12L11 14L15 10"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-xs text-gray-500">Données chiffrées</span>
                    </div>

                    <div className="flex items-center">
                        <svg
                            className="w-8 h-8 text-gray-400 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 15V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M5 10H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path
                                d="M17 7L17 19C17 20.1046 16.1046 21 15 21L9 21C7.89543 21 7 20.1046 7 19L7 7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-xs text-gray-500">Remboursement facile</span>
                    </div>
                </div>
            )}
        </form>
    )
}

// Composant principal de la page de paiement
const Payment = () => {
    const location = useLocation()
    const { reservationId, amount } = location.state || {}
    const [showOrderSummary, setShowOrderSummary] = useState(false)

    // Données factices pour le résumé de la commande
    const orderDetails = [
        {
            name: "Réservation Premium",
            description: "Accès prioritaire inclus",
            price: amount ? amount - 30 : 0,
            icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
        },
        {
            name: "Assurance annulation",
            description: "Protection complète",
            price: 20,
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        },
        {
            name: "Service prioritaire",
            description: "Support dédié 24/7",
            price: 10,
            icon: "M13 10V3L4 14h7v7l9-11h-7z",
        },
    ]

    if (!reservationId || !amount) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-md w-full">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-yellow-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Informations manquantes</h2>
                        <p className="text-gray-600 mb-6">
                            Les informations de réservation sont manquantes. Veuillez retourner à l'écran précédent.
                        </p>
                        <button
                            onClick={() => window.history.back()}
                            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            {/* En-tête */}
            <div className="max-w-5xl mx-auto mb-12">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Finaliser votre réservation
                    </h1>
                    <p className="mt-3 text-base text-gray-600 max-w-xl mx-auto">
                        Vous êtes à quelques instants de confirmer votre réservation. Complétez les informations ci-dessous pour
                        finaliser.
                    </p>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="max-w-5xl mx-auto">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
                    {/* Formulaire de paiement */}
                    <div className="lg:col-span-7">
                        <Elements stripe={stripePromise}>
                            <CheckoutForm reservationId={reservationId} amount={amount} />
                        </Elements>
                    </div>

                    {/* Résumé de la commande */}
                    <div className="lg:col-span-5 mt-10 lg:mt-0">
                        {/* Version mobile - bouton toggle */}
                        <div className="lg:hidden mb-6">
                            <button
                                type="button"
                                className="w-full flex justify-between items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => setShowOrderSummary(!showOrderSummary)}
                            >
                                <span>Résumé de la commande</span>
                                <svg
                                    className={`w-5 h-5 text-gray-500 transition-transform ${showOrderSummary ? "transform rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showOrderSummary && (
                                <div className="mt-4">
                                    <OrderSummary reservationId={reservationId} amount={amount} details={orderDetails} />
                                </div>
                            )}
                        </div>

                        {/* Version desktop - toujours visible */}
                        <div className="hidden lg:block sticky top-6">
                            <OrderSummary reservationId={reservationId} amount={amount} details={orderDetails} />

                            <div className="mt-8 bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 p-6">
                                <h3 className="text-base font-medium text-gray-900 mb-4">Besoin d'aide ?</h3>
                                <div className="space-y-4">
                                    <a href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        FAQ
                                    </a>
                                    <a href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Contacter le support
                                    </a>
                                    <a href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                        +33 1 23 45 67 89
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pied de page */}
            <div className="max-w-5xl mx-auto mt-16 pt-8 border-t border-gray-200">
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center space-x-4 mb-4">
                        <img src="/placeholder.svg?height=24&width=40" alt="Visa" className="h-6" />
                        <img src="/placeholder.svg?height=24&width=40" alt="Mastercard" className="h-6" />
                        <img src="/placeholder.svg?height=24&width=40" alt="American Express" className="h-6" />
                        <img src="/placeholder.svg?height=24&width=40" alt="PayPal" className="h-6" />
                        <img src="/placeholder.svg?height=24&width=40" alt="Apple Pay" className="h-6" />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                        &copy; {new Date().getFullYear()} Votre Entreprise. Tous droits réservés. En effectuant ce paiement, vous
                        acceptez nos{" "}
                        <a href="#" className="underline">
                            Conditions d'utilisation
                        </a>{" "}
                        et notre{" "}
                        <a href="#" className="underline">
                            Politique de confidentialité
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Payment

