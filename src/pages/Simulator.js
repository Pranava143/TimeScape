import React, { useState } from "react";
import Navbar from "../components/Navbar.js"; // Ensure .js extension is correct for your setup

function Simulator() {
  // Input States
  const [simulationCategory, setSimulationCategory] = useState("Life");
  const [actualDecision, setActualDecision] = useState("");
  const [whatIfChoice, setWhatIfChoice] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [contextualDate, setContextualDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [location, setLocation] = useState(""); // For weather/country context

  // Output States
  const [simulationResult, setSimulationResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Keys (Replace with your actual keys)
  const NEWS_API_KEY = 'b67971a3fa0a44f29ed7d72dbc6ef3f3'; // Replace with your NewsAPI.org key
  // Note: Open-Meteo and REST Countries generally don't require API keys for basic usage.

  // Options for dropdowns and tags
  const categories = ["Life", "Career", "Relationships", "Education", "Health", "World Events"];
  const emotions = ["Regret", "Hope", "Guilt", "Excitement", "Anxiety", "Joy", "Peace", "Fear", "Curiosity"];

  const handleEmotionTagClick = (tag) => {
    setSelectedEmotions((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const fetchContextualData = async () => {
    let contextualInfo = [];

    // 1. Fetch News (NewsAPI.org)
    try {
      if (NEWS_API_KEY === 'YOUR_NEWSAPI_KEY' || !NEWS_API_KEY) {
        throw new Error("NewsAPI.org API key is missing. Cannot fetch news context.");
      }
      const newsQuery = `q=${simulationCategory === "World Events" ? "global events" : "top news"} on ${contextualDate}&from=${contextualDate}&to=${contextualDate}&sortBy=relevancy&language=en&apiKey=${NEWS_API_KEY}`;
      const newsUrl = `https://newsapi.org/v2/everything?${newsQuery}`;
      const newsResponse = await fetch(newsUrl);
      const newsData = await newsResponse.json();
      if (newsData.articles && newsData.articles.length > 0) {
        contextualInfo.push("Top News Headlines:");
        newsData.articles.slice(0, 2).forEach(article => { // Get top 2 headlines
          contextualInfo.push(`- "${article.title}" (${article.source.name})`);
        });
      }
    } catch (err) {
      console.warn("Failed to fetch news context:", err.message);
      contextualInfo.push("News Context: Could not retrieve relevant news for the date.");
    }

    // 2. Fetch Weather (Open-Meteo) - Requires Lat/Lon. Using a general query for simplicity.
    // For a real app, you'd use a geocoding API (e.g., OpenCage, Google Geocoding)
    // to convert 'location' string to lat/lon first.
    try {
        if (location && (simulationCategory === "Health" || simulationCategory === "Life")) {
            // Using a placeholder for lat/lon for demonstration.
            // For actual use, you'd need a geocoding step here.
            // Example for London: lat=51.5074&lon=0.1278
            const weatherLat = 51.5074; // Example: London
            const weatherLon = 0.1278; // Example: London
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${weatherLat}&longitude=${weatherLon}&hourly=temperature_2m,weathercode&start_date=${contextualDate}&end_date=${contextualDate}`;
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();
            if (weatherData.hourly && weatherData.hourly.temperature_2m && weatherData.hourly.temperature_2m.length > 0) {
                const avgTemp = weatherData.hourly.temperature_2m.reduce((a, b) => a + b, 0) / weatherData.hourly.temperature_2m.length;
                contextualInfo.push(`Weather in ${location || 'a major city'} on ${contextualDate}: Average temperature was ${avgTemp.toFixed(1)}°C.`);
            }
        }
    } catch (err) {
        console.warn("Failed to fetch weather context:", err.message);
        contextualInfo.push("Weather Context: Could not retrieve weather data for the location and date.");
    }

    // 3. Fetch Country Info (REST Countries)
    try {
        if (location) {
            const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(location)}?fullText=true`);
            const countryData = await countryResponse.json();
            if (countryData && countryData.length > 0) {
                const country = countryData[0];
                contextualInfo.push(`Location Context: ${country.name.common} (Capital: ${country.capital ? country.capital[0] : 'N/A'}, Population: ${country.population ? country.population.toLocaleString() : 'N/A'}).`);
            }
        }
    } catch (err) {
        console.warn("Failed to fetch country context:", err.message);
        contextualInfo.push("Location Context: Could not retrieve country data for the specified location.");
    }

    return contextualInfo.join('\n');
  };

  const handleSimulate = async () => {
    setError(null);
    setSimulationResult("");
    setIsLoading(true);

    if (!actualDecision || !whatIfChoice || selectedEmotions.length === 0) {
      setError("Please fill in all decision details and select at least one emotion.");
      setIsLoading(false);
      return;
    }

    try {
      const contextualData = await fetchContextualData();

      // Modified prompt to request a bulleted list of 10-20 points
      const prompt = `
Actual Decision: ${actualDecision}
What If: ${whatIfChoice}
Emotions Felt: ${selectedEmotions.join(', ')}
Contextual Info:
${contextualData || "No specific real-world context available."}

Simulate an alternate reality based on the "What If" scenario. Narrate the outcome as a bulleted list of 10 to 20 key points, focusing on the chain of events and the emotional impact. Each point should be concise.
`;

      const chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "text/plain", // Expecting a narrative text response
          temperature: 0.7, // Adjust for creativity
          maxOutputTokens: 400, // Limit to approx 300 words (1 token ~ 0.75 words) - adjusted for points
        }
      };

      const apiKey = "AIzaSyBTiBcCWMHz6hRQMJxl9pQ_ITN2pJ897qo"; // Canvas will provide this at runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        setSimulationResult(result.candidates[0].content.parts[0].text);
      } else {
        setSimulationResult("Could not generate a simulation. Please try again.");
      }
    } catch (err) {
      console.error("Simulation error:", err);
      setError(err.message || "An unexpected error occurred during simulation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#151122] text-white font-inter">
      <Navbar />
      <div className="flex flex-col items-center flex-1 w-full p-4 md:pt-8 md:pb-12">
        <div className="layout-content-container flex flex-col md:flex-row md:items-start max-w-[1200px] flex-1 w-full gap-8"> {/* Changed to flex-row and added gap */}
          
          {/* Input Form (Left Side) */}
          <div className={`bg-[#2c2348] p-6 md:p-8 rounded-xl shadow-lg w-full ${simulationResult ? 'md:w-2/5' : 'max-w-2xl mx-auto'}`}> {/* Changed md:w-1/2 to md:w-2/5 */}
            <h1 className="text-white tracking-light text-3xl md:text-4xl font-bold leading-tight px-4 text-center pb-3 pt-6">What If Simulator</h1>
            <h2 className="text-[#5b2aed] text-xl font-bold mb-4">Craft Your Alternate Reality</h2>
            <div className="space-y-6">
              {/* Simulation Category */}
              <div>
                <label className="block text-[#a092c9] text-sm font-medium mb-2">Simulation Category</label>
                <select
                  className="form-input w-full rounded-xl h-12 bg-[#3f3267] text-white focus:outline-none focus:ring-2 focus:ring-[#5b2aed] p-3 text-base font-normal leading-normal appearance-none"
                  value={simulationCategory}
                  onChange={(e) => setSimulationCategory(e.target.value)}
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(160,146,201)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Actual Decision */}
              <div>
                <label className="block text-[#a092c9] text-sm font-medium mb-2">Your Actual Decision</label>
                <textarea
                  placeholder="Describe the decision you actually made..."
                  className="form-textarea w-full rounded-xl h-24 bg-[#3f3267] text-white focus:outline-none focus:ring-2 focus:ring-[#5b2aed] p-3 text-base font-normal leading-normal resize-y"
                  value={actualDecision}
                  onChange={(e) => setActualDecision(e.target.value)}
                ></textarea>
              </div>

              {/* What If Scenario */}
              <div>
                <label className="block text-[#a092c9] text-sm font-medium mb-2">What If You Chose...</label>
                <textarea
                  placeholder="Describe the alternate path you're curious about..."
                  className="form-textarea w-full rounded-xl h-24 bg-[#3f3267] text-white focus:outline-none focus:ring-2 focus:ring-[#5b2aed] p-3 text-base font-normal leading-normal resize-y"
                  value={whatIfChoice}
                  onChange={(e) => setWhatIfChoice(e.target.value)}
                ></textarea>
              </div>

              {/* Contextual Date */}
              <div>
                <label className="block text-[#a092c9] text-sm font-medium mb-2">Decision Date (for context)</label>
                <input
                  type="date"
                  className="form-input w-full rounded-xl h-12 bg-[#3f3267] text-white focus:outline-none focus:ring-2 focus:ring-[#5b2aed] p-3 text-base font-normal leading-normal"
                  value={contextualDate}
                  onChange={(e) => setContextualDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Location for Context */}
              <div>
                <label className="block text-[#a092c9] text-sm font-medium mb-2">Location (for weather/country context)</label>
                <input
                  type="text"
                  placeholder="e.g., London, Japan"
                  className="form-input w-full rounded-xl h-12 bg-[#3f3267] text-white focus:outline-none focus:ring-2 focus:ring-[#5b2aed] p-3 text-base font-normal leading-normal"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Emotions Felt */}
              <div>
                <label className="block text-[#a092c9] text-sm font-medium mb-2">Emotions Felt</label>
                <div className="flex flex-wrap gap-2">
                  {emotions.map(emotion => (
                    <button
                      key={emotion}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200
                        ${selectedEmotions.includes(emotion) ? "bg-[#5b2aed] text-white" : "bg-[#3f3267] text-[#a092c9] hover:bg-[#4f4277]"}`}
                      onClick={() => handleEmotionTagClick(emotion)}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulate Button */}
              <div className="pt-4">
                <button
                  onClick={handleSimulate}
                  className="w-full bg-[#5b2aed] hover:bg-[#6c3bed] text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Simulating Alternate Reality..." : "Simulate Alternate Reality"}
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-800 text-white p-4 rounded-lg mt-6 text-center">
                  <p className="font-bold">Error:</p>
                  <p>{error}</p>
                  {error.includes("NewsAPI.org API key is missing") && (
                    <p className="text-sm mt-2">Please obtain a free API key from <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer" className="underline">newsapi.org</a> and update the `NEWS_API_KEY` constant in `Simulator.js`.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Simulation Results Output (Right Side - conditionally rendered) */}
          {simulationResult && (
            <div className="bg-[#2c2348] p-6 md:p-8 rounded-xl shadow-lg w-full md:w-3/5 mb-8 md:mb-0"> {/* Adjusted width */}
              <h2 className="text-[#5b2aed] text-xl font-bold mb-4">Your Alternate Timeline Unfolds...</h2>
              <div className="bg-[#1a132e] p-4 rounded-lg text-[#e0e0e0] whitespace-pre-wrap leading-relaxed border border-[#3f3267]">
                {simulationResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Simulator;
