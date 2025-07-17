import React, { useState } from "react";
import Navbar from '../components/Navbar.js'; // Import the Navbar component - Added .js extension

function NewsTimeCapsule() {
  const [selectedDate, setSelectedDate] = useState(""); // State for the selected date (YYYY-MM-DD)
  const [newsData, setNewsData] = useState([]); // State to store news data from the API
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for API errors

  // IMPORTANT: Replace 'YOUR_NEWSAPI_KEY' with your actual API key from NewsAPI.org
  // For production, use a server-side proxy to protect your API key!
  const NEWS_API_KEY = 'b67971a3fa0a44f29ed7d72dbc6ef3f3'; 
  const NEWS_API_BASE_URL = 'https://newsapi.org/v2/everything';

  const handleFetchNews = async () => {
    setError(null); // Clear previous errors
    setNewsData([]); // Clear previous results
    setIsLoading(true); // Set loading state

    // Basic validation for date input
    if (!selectedDate) {
      setError("Pick a day to begin your news time travel."); // Enhanced message
      setIsLoading(false);
      return;
    }

    // Check if API key is provided
    if (NEWS_API_KEY === 'YOUR_NEWSAPI_KEY' || !NEWS_API_KEY) {
      setError("NewsAPI.org API key is missing. Please get one from newsapi.org and replace 'YOUR_NEWSAPI_KEY' in the code.");
      setIsLoading(false);
      return;
    }

    try {
      // Format date for NewsAPI.org (YYYY-MM-DD)
      const formattedDate = selectedDate; 

      // Construct the URL for NewsAPI.org
      // We'll search for general top headlines on that date.
      const query = `q=top news&from=${formattedDate}&to=${formattedDate}&sortBy=relevancy&language=en&apiKey=${NEWS_API_KEY}`;
      const apiUrl = `${NEWS_API_BASE_URL}?${query}`;

      console.log(`Fetching news from: ${apiUrl}`);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed with status ${response.status}: ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();

      const fetchedArticles = [];
      if (result.articles && result.articles.length > 0) {
        // Limit to top few results
        const articlesToDisplay = result.articles.slice(0, 5); // Display top 5 articles

        articlesToDisplay.forEach(article => {
          fetchedArticles.push({
            title: article.title || "Untitled Headline", // Enhanced message
            summary: article.description || article.content || "No details found for this story.", // Enhanced message
            url: article.url || null,
            // Include urlToImage from the article
            urlToImage: article.urlToImage || null,
            publicationTime: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'N/A'
          });
        });
      } else {
        fetchedArticles.push({
          title: "No Headlines Found for This Date", // Enhanced message
          summary: "Could not retrieve top news for this date from NewsAPI.org.",
          url: null,
          urlToImage: null, // Ensure urlToImage is null if no articles
          publicationTime: 'N/A'
        });
      }
      setNewsData(fetchedArticles); // Update state with fetched news data
    } catch (err) {
      console.error("Error fetching news data from NewsAPI.org:", err);
      setError(err.message || "An unexpected error occurred during data retrieval from NewsAPI.org.");
    } finally {
      setIsLoading(false); // Clear loading state
    }
  };

  // The control buttons below are kept for UI consistency but their logic
  // would need to be re-evaluated if they are still relevant for a news display.
  return (
    // Main container for the entire page, including Navbar
    <div className="flex flex-col min-h-screen bg-[#151122] text-white font-inter">
      <Navbar /> {/* Render the Navbar component here */}

      <div className="flex flex-col items-center flex-1 w-full p-4 md:pt-8 md:pb-12"> {/* Adjusted padding */}
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full">
          <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em] mb-2 text-center md:text-left">NewsTimeCapsule - Daily News</h1>
          <p className="text-[#a092c9] text-base md:text-lg font-normal leading-normal mb-8 text-center md:text-left">
            Step into the past. Discover what made headlines on any given day.
          </p>

          {/* Date Input */}
          <div className="w-full max-w-[400px] mx-auto mb-8 flex flex-col gap-4 justify-center items-center">
            <label className="flex flex-col w-full">
              <span className="text-[#a092c9] text-sm mb-1">Select Date</span>
              <input
                type="date"
                className="form-input flex w-full resize-none overflow-hidden rounded-xl h-14 bg-[#2c2348] text-white focus:outline-none focus:ring-2 focus:ring-[#5b2aed] placeholder:text-[#a092c9] p-4 text-base font-normal leading-normal transition-all duration-200"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]} // Prevent selecting future dates
              />
            </label>
          </div>

          {/* Fetch News Button */}
          <div className="flex justify-center mb-12">
            <button
              onClick={handleFetchNews}
              className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-[#5b2aed] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#6c3bed] transition-colors duration-200 shadow-md"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? "Bringing Headlines from the Past..." : "Explore Headlines"}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-800 text-white p-4 rounded-lg mb-8 text-center max-w-[600px] mx-auto">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
              {error.includes("API key is missing") && (
                <p className="text-sm mt-2">Please obtain a free API key from <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer" className="underline">newsapi.org</a> and update the `NEWS_API_KEY` constant in `NewsTimeCapsule.js`.</p>
              )}
            </div>
          )}

          {/* News Display Section */}
          <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] mb-6 text-center md:text-left">Headlines from {selectedDate || 'Selected Date'}</h2>
          
          {newsData.length === 0 && !isLoading && !error && (
            <p className="text-[#a092c9] text-center mb-8">Nothing here yet. Choose a date and unlock the headlines of that day.</p>
          )}

          {newsData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {newsData.map((item, index) => (
                <div key={index} className="bg-[#2c2348] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  {/* Image display using item.urlToImage with a placeholder fallback */}
                  <img
                    src={item.urlToImage || `https://placehold.co/600x400/2c2348/a092c9?text=Flashback%3A+${item.publicationTime}`}
                    alt={item.title || `Flashback: ${item.publicationTime}`}
                    className="w-full h-48 object-cover"
                    // Optional: onError to handle broken image links
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/2c2348/a092c9?text=Flashback%3A+${item.publicationTime}`; }}
                  />
                  <div className="p-4">
                    <h3 className="text-white text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-[#a092c9] text-sm mb-3">{item.summary}</p>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#5b2aed] hover:underline text-sm">
                        Read Full Story
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default NewsTimeCapsule;
