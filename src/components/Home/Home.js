import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import LandingPage from "./LandingPage";
import NewsFeed from "./NewsFeed/NewsFeed";

const Home = () => {
  const { currentUser } = useAuth();
  return (
    currentUser ? (
      <NewsFeed />
    ) : (
      <LandingPage />
    )
  );
};

export default Home;
