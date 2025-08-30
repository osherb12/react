# BizBoard

BizBoard is a full-stack web application that allows users to discover and review businesses. It features a modern, responsive frontend built with React and a robust backend powered by Node.js and Express.

## Features

*   **User Authentication:** Secure user registration and login using Firebase Authentication.
*   **Business Listings:** View a grid of businesses with details like name, description, and image.
*   **Business Profiles:** Detailed page for each business with more information and user reviews.
*   **Categories:** Filter businesses by category.
*   **Reviews:** Users can add and view reviews for businesses.
*   **Create and Manage Businesses:** Authenticated users can create and manage their own business listings.

## Technologies Used

**Frontend:**

*   [React](https://reactjs.org/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Vite](https://vitejs.dev/)
*   [Chakra UI](https://chakra-ui.com/)
*   [React Router](https://reactrouter.com/)
*   [Axios](https://axios-http.com/)
*   [Firebase](https://firebase.google.com/)

**Backend:**

*   [Node.js](https://nodejs.org/)
*   [Express](https://expressjs.com/)
*   [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
*   [CORS](https://expressjs.com/en/resources/middleware/cors.html)
*   [Multer](https://github.com/expressjs/multer) for file uploads

## How to Run the Project

### Prerequisites

*   Node.js and npm installed on your machine.
*   A Firebase project with Authentication and Firestore enabled.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/osherb12/react.git
    cd react
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

3.  **Install backend dependencies:**
    ```bash
    cd server
    npm install
    cd ..
    ```

### Configuration

1.  **Frontend Firebase Configuration:**
    -   Create a `.env` file in the root directory.
    -   Add your Firebase project configuration to the `.env` file. See `src/firebase.ts` for the required variables.

2.  **Backend Firebase Configuration:**
    -   Create a `.env` file in the `server` directory.
    -   Add your Firebase Admin SDK configuration. You will need a service account key file. See `server/config.js` and `server/services/firebase.js`.

### Running the Application

1.  **Start the backend server:**
    ```bash
    node server/server.js
    ```
    The server will be running at `http://localhost:3001`.

2.  **Start the frontend development server:**
    In a new terminal, from the root directory:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Author

*   **Osher Buchris**