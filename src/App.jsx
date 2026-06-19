import React from "react";
import { GameProvider, useGame } from "./context/GameContext";
import HomePage from "./pages/HomePage";
import SetupPage from "./pages/SetupPage";
import GamePage from "./pages/GamePage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import LeaderPage from "./pages/LeaderPage";

function Router() {
  const { state } = useGame();
  switch (state.screen) {
    case "home":
      return <HomePage />;
    case "setup":
      return <SetupPage />;
    case "game":
      return <GamePage />;
    case "result":
      return <ResultPage />;
    case "history":
      return <HistoryPage />;
    case "leaderboard":
      return <LeaderPage />;
    default:
      return <HomePage />;
  }
}
export default function App() {
  return (
    <GameProvider>
      <Router />
    </GameProvider>
  );
}
