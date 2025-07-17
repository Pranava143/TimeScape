import React from "react";
import { getUsername } from "../utils/auth.js"; // Assuming getUsername is available
import Navbar from "../components/Navbar.js";

function Home() {
  const username = getUsername(); // Get the logged-in username

  return (
    <><Navbar /><div className="flex flex-col items-center justify-center min-h-screen bg-[#151122] text-white p-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 leading-tight">
        Welcome, <span className="text-[#5b2aed] dark:text-[#6c3bed]">{username || "Guest"}</span>!
      </h1>
      <p className="text-lg md:text-xl text-center max-w-2xl mb-8 text-[#a092c9]">
        You've successfully logged in to TimeScape. Explore our powerful tools to simulate and replay web experiences.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Card for WhatIf Simulator */}
        <div className="bg-[#2c2348] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-3 text-[#5b2aed] dark:text-[#6c3bed]">WhatIf Simulator</h2>
          <p className="text-[#a092c9] mb-4">
            Unleash the power of hypothetical scenarios. Simulate decisions and explore their potential outcomes over time.
          </p>
          <a
            href="/simulator"
            className="inline-block bg-[#5b2aed] hover:bg-[#6c3bed] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Go to Simulator
          </a>
        </div>

        {/* Card for Web Replayer */}
        <div className="bg-[#2c2348] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-3 text-[#5b2aed] dark:text-[#6c3bed]">News Time Capsule</h2>
          <p className="text-[#a092c9] mb-4">
            Revisit past web interactions. Replay user journeys and analyze historical data with precision.
          </p>
          <a
            href="/newstimecapsule"
            className="inline-block bg-[#5b2aed] hover:bg-[#6c3bed] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Go to Replayer
          </a>
        </div>
      </div>

      <div className="mt-12 text-[#a092c9] text-sm">
        <p>&copy; 2024 TimeScape. All rights reserved.</p>
      </div>
    </div></>
  );
}

export default Home;
