
## HandicraftStore

HandicraftStore is a full-stack e-commerce platform designed to connect artisans and buyers, focusing on promoting and selling handcrafted products. The platform provides an intuitive and responsive experience for both sellers and buyers, enabling sellers to manage their shops, upload products, and monitor sales, while buyers can browse categories, view product details, and place orders seamlessly.

## Features

- User Roles:
  - Admin: Manages users, products, and sales data.
  - Seller: Uploads products, manages shop details, and monitors sales.
  - Customer: Browses products, places orders, and leaves ratings.

- Product Management:
  - Sellers can upload products with customizable specifications.
  - Admin can view product statistics and manage listings.

- Order Handling:
  - Customers can place orders, and sellers can track them.
  - Admin can monitor overall sales and customer activity.

- Rating System:
  - Customers can rate products, and sellers can view ratings.

- Responsive Design:
  - Built with a modern, mobile-first approach using React.js and Tailwind CSS.

- Secure Authentication:
  - JWT-based authentication for secure login and registration.

- Email Notifications:
  - Integrated with Nodemailer for email notifications and password resets.

- Image Uploads:
  - Cloudinary integration for product image uploads.

## Technologies Used

- Frontend:  
  - React.js  
  - Tailwind CSS  

- Backend:  
  - Node.js  
  - Express.js  

- Database:  
  - MongoDB  
  - Mongoose  

- Other Tools:
  - Cloudinary (for image uploads)
  - Nodemailer (for email notifications)
  - JWT (for authentication)

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js
- MongoDB (local or remote instance)

### Clone the Repository

```bash
git clone https://github.com/syedhisham/HandicraftStore.git
cd HandicraftStore
```

### Install Dependencies

For both frontend and backend, run the following commands:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install
```

### Set Up Environment Variables

Create a `.env` file in both the backend and frontend directories and add the following environment variables:

#### Backend `.env` file:

```env
PORT=<Your Server Port>
MONGODB_URI=<Your MongoDB URI>
CORS_ORIGIN=<Your Frontend URL >
NODE_ENV=<Your Node Environment >
ACCESS_TOKEN_SECRET=<Your Access Token Secret>
ACCESS_TOKEN_EXPIRY=<Access Token Expiry>
REFRESH_TOKEN_SECRET=<Your Refresh Token Secret>
REFRESH_TOKEN_EXPIRY=<Refresh Token Expiry>
JWT_SECRET=<Your JWT Secret>
SMTP_EMAIL=<Your SMTP Email>
SMTP_PASSWORD=<Your SMTP Password>
CLIENT_URL=<Your Frontend URL>
CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
STRIPE_SECRET_KEY=<Your Cloudinary API Secret>
```

### Key Points:

- The Backend and Frontend directories should be treated separately for installation.
- The `.env` files are required to store sensitive keys like MongoDB URI, JWT Secret, and Cloudinary URL.
- You can run both servers locally using `npm run server` and `npm run client`.

### Running the Application

After setting up the environment variables, you can run the application locally:

```bash
# Start the backend server
cd backend
npm run dev

# In a new terminal window, start the frontend server
cd frontend
npm run dev
```

The application will be available at:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:8000](http://localhost:8000)

## Contact

For any inquiries, feel free to reach out at [syedhishamshah27@gmail.com].


### Key Changes:
1. Fixed the markdown formatting for code blocks and environment variables.
2. Added code blocks around commands for better clarity.
3. Corrected the `.env` file sections with proper indentation.
