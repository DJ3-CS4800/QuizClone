// App.tsx
import { Routes, Route } from "react-router-dom";
import MainPage from './components/screens/main-page';  // Your main page component
import LoginPage from './components/screens/signin-page';  // Your login page component
import DeckPage from "./components/screens/deck-page";
import RegistrationPage from "./components/screens/registration-page";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/deck/:deckID" element={<DeckPage />} />
      <Route path="/register" element={<RegistrationPage />} />
    </Routes>
  );
};

export default App;
