import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Elements } from "@stripe/react-stripe-js"; // Import Elements
import { loadStripe } from "@stripe/stripe-js"; // Import loadStripe

// Initialize Stripe
const stripePromise = loadStripe("pk_test_51QbNGkGAMu5UjAbaQoMlWEhZbBiOaQC8FQDQVDkF7qbm4ORn3NBzsMLjLlPE2q4I9J9LxYAmvUxtypl3zQ55VajV009DGIZquL");


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Elements stripe={stripePromise}>
            <App />
          </Elements>
  </StrictMode>
)
