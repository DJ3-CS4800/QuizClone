// App.tsx
import { Routes, Route } from "react-router-dom";
import MainPage from './components/screens/main-page';  // Your main page component
import LoginPage from './components/screens/signin-page';  // Your login page component
import DeckPage from "./components/screens/deck-page";
import RegistrationPage from "./components/screens/registration-page";
import CreateDeckPage from "./components/screens/create-deck-page";
import QuizPage from "./components/screens/quiz-page"; // Import the QuizPage component
import EditDeckPage from "./components/screens/edit-deck-page"; // Import the EditDeckPage component

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/deck/:deckType/:deckID" element={<DeckPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/create-deck" element={<CreateDeckPage />} />
      <Route path="/deck/:deckType/:deckID/study" element={<QuizPage />} />
      <Route path="/deck/:deckType/:deckID/edit" element={< EditDeckPage/>} />
    </Routes>
  );
};

export default App;
