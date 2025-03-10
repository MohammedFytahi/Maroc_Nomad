import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Initialize Stripe
const stripePromise = loadStripe('your_stripe_public_key'); // Replace with your actual public key

const CheckoutForm = ({ reservationId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [succeeded, setSucceeded] = useState(false);
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState('EUR');

    useEffect(() => {
        // Create PaymentIntent as soon as the component loads
        axios.post(`/api/payments/create-payment-intent/${reservationId}`)
            .then(response => {
                setClientSecret(response.data.clientSecret);
                setAmount(response.data.amount);
                setCurrency(response.data.currency);
            })
            .catch(err => {
                setError(`Erreur de paiement: ${err.message}`);
            });
    }, [reservationId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        if (!stripe || !elements) {
            return;
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    // Vous pouvez ajouter des détails de facturation ici si nécessaire
                },
            }
        });

        if (result.error) {
            setError(`Paiement échoué: ${result.error.message}`);
            setProcessing(false);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                setError(null);
                setSucceeded(true);
                setProcessing(false);

                // Informer le serveur que le paiement est réussi
                axios.post(`/api/payments/confirm/${result.paymentIntent.id}`)
                    .then(() => {
                        // Rediriger vers une page de confirmation ou mettre à jour l'UI
                        window.location.href = `/reservations/${reservationId}/confirmation`;
                    })
                    .catch(err => {
                        setError(`Confirmation du paiement échouée: ${err.message}`);
                    });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <h2>Paiement de la réservation</h2>
            <p>Montant: {amount} {currency}</p>

            <div className="form-row">
                <label htmlFor="card-element">Carte de crédit ou de débit</label>
                <CardElement
                    id="card-element"
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
                type="submit"
                disabled={processing || !stripe || succeeded}
                className="pay-button"
            >
                {processing ? 'Traitement...' : 'Payer maintenant'}
            </button>

            {succeeded && (
                <div className="success-message">
                    Paiement réussi! Redirection vers la page de confirmation...
                </div>
            )}
        </form>
    );
};

const PaymentComponent = ({ reservationId }) => {
    return (
        <div className="payment-container">
            <Elements stripe={stripePromise}>
                <CheckoutForm reservationId={reservationId} />
            </Elements>
        </div>
    );
};

export default PaymentComponent;
