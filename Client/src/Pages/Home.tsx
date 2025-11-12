import React from "react";
import Navbar from "../Components/AuthenticatedNavbar";
import WelcomeSection from "../Components/WelcomeSection";
import PostsList from "../Components/Posts/PostsList";
import Footer from "../Components/Footer";

const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 smooth-transition ">
      <Navbar />
      <main>
        <WelcomeSection />
        <PostsList />
      </main>
      <Footer id="footer" />
    </div>
  );
};

export default Homepage;
