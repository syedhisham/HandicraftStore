import { Session } from '../../models/session/session.model.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout session for embedded payment
const createCheckoutSession = async (req, res) => {
  const { amount } = req.body; // Amount in USD
  const YOUR_DOMAIN = 'http://localhost:5173/checkout'; // Replace with your actual domain

  try {
    // Create a Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'pkr',
            product_data: {
              name: 'Order Payment', // Example product name
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // Payment mode (you can use 'subscription' if needed)
      success_url: `${YOUR_DOMAIN}?session_id={CHECKOUT_SESSION_ID}`, // Success redirect
      cancel_url: `${YOUR_DOMAIN}?payment-cancelled`, // Cancel redirect
    });
     // Store session in the database with initial 'pending' status
     await new Session({
      sessionId: session.id,
      status: 'pending',
    }).save();

    res.status(200).json({
      clientSecret: session.client_secret, // Provide the client secret to the frontend
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
};

// Get session status after payment
const getSessionStatus = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

        // Check if the session exists in your database
        const storedSession = await Session.findOne({ sessionId: session_id });

        if (!storedSession) {
          return res.status(400).json({ message: 'Invalid session' });
        }
    
        // Check if the session has already been completed or cancelled
        if (storedSession.status === 'completed') {
          return res.status(400).json({ message: 'This session has already been used' });
        }
    
      storedSession.customerEmail = session.customer_details.email;
      await storedSession.save();

    res.status(200).send({
      status: session.status,
      customer_email: session.customer_details.email,
    });
  } catch (error) {
    console.error('Error retrieving session status:', error);
    res.status(500).json({ message: 'Error retrieving session status' });
  }
};

// Set session status to completed manually
const completeSession = async (req, res) => {
  const { session_id } = req.body; // Expecting session_id in the request body

  try {
    // Retrieve the session from the database
    const storedSession = await Session.findOne({ sessionId: session_id });

    if (!storedSession) {
      return res.status(400).json({ message: 'Session not found' });
    }

    // Check if the session is already completed or cancelled
    if (storedSession.status === 'completed') {
      return res.status(400).json({ message: 'This session has already been completed' });
    }

    // Update session status to 'completed'
    storedSession.status = 'completed';
    await storedSession.save();

    res.status(200).json({ message: 'Session status updated to completed' });
  } catch (error) {
    console.error('Error updating session status:', error);
    res.status(500).json({ message: 'Error updating session status' });
  }
};


export { createCheckoutSession, getSessionStatus, completeSession };
