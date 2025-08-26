# Collaborative Whiteboard Application

A real-time, multi-user digital whiteboard application built with the MERN stack (minus MongoDB) and Socket.IO. This project allows users to join a shared canvas, choose a username, and draw together, seeing each other's creations instantly.



## Key Features

- **Real-Time Collaboration**: Drawings appear on everyone's screen instantly thanks to WebSockets.
- **Username Selection**: Users are prompted to choose a username before joining the session.
- **Live User List**: A sidebar displays a list of all currently connected users.
- **Dynamic UI**:
    - A draggable toolbox contains all drawing instruments.
    - A resizable sidebar allows users to customize their workspace.
- **Comprehensive Drawing Tools**:
    - A quick-select color palette and a custom color picker.
    - An adjustable brush size slider.
    - An eraser tool that uses the canvas's background color.
    - A "Clear Canvas" button that wipes the board for everyone.
- **Modern Interface**: A fixed dark mode theme with a high-contrast white canvas for a comfortable drawing experience.

## Technology Stack

### Backend

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **Socket.IO**: Library for real-time, bidirectional event-based communication.

### Frontend

- **React**: JavaScript library for building user interfaces.
- **Socket.IO Client**: Client-side library to connect with the Socket.IO server.
- **CSS**: Custom styling for a modern, responsive layout.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You must have Node.js and npm (Node Package Manager) installed on your system. You can download them from [nodejs.org](https://nodejs.org/).

### Installation

1.  **Clone the repository** to your local machine:
    ```bash
    git clone [https://github.com/your-username/collaborative-whiteboard.git](https://github.com/your-username/collaborative-whiteboard.git)
    cd collaborative-whiteboard
    ```

2.  **Set up the Backend Server**:
    - Navigate to the backend directory and install the required npm packages.
        ```bash
        cd back
        npm install
        ```
    - Start the backend server. It will run on `http://localhost:3001`.
        ```bash
        node index.js
        ```

3.  **Set up the Frontend Application**:
    - Open a **new terminal window** and navigate to the frontend directory.
    - Install the required npm packages.
        ```bash
        cd front
        npm install
        ```
    - Start the React development server. It will run on `http://localhost:3000`.
        ```bash
        npm start
        ```

4.  **Usage**:
    - Open your web browser and navigate to `http://localhost:3000`.
    - You will be prompted to enter a username.
    - To see the real-time collaboration in action, open a second browser tab or window to the same address and join with a different username.
    - Draw on one canvas and watch it appear on the other!

---

## Project Structure

The project is organized into two main folders for a clean separation of concerns:

- **`/back`**: Contains the Node.js and Express server, responsible for all Socket.IO communication and user management.
- **`/front`**: Contains the React application, which handles all the UI, state management, and client-side logic.

## License

This project is licensed under the MIT License.
