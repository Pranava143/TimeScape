import React, { useState } from 'react';
import Navbar from "../components/Navbar.js";

function Feedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const emojis = [
    { emoji: '😃', value: 'happy' },
    { emoji: '😐', value: 'neutral' },
    { emoji: '😢', value: 'sad' },
    { emoji: '😲', value: 'surprised' },
    { emoji: '🤯', value: 'mindblown' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSubmitted(false);

    const feedbackPayload = {
      rating: rating,
      feedbackText: feedbackText,
      emojiReaction: selectedEmoji,
      timestamp: new Date().toISOString(),
    };

    try {
      // Simulate API call success
      // In a real application, you would replace this with an actual fetch to your backend:
      // const response = await fetch('https://your-actual-api.com/feedback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(feedbackPayload),
      // });
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Failed to send feedback.');
      // }

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // Simulate a successful response
      console.log('Simulated feedback submission:', feedbackPayload);
      setIsSubmitted(true);
      setRating(0);
      setFeedbackText('');
      setSelectedEmoji(null);

      // Optionally hide the thank you message after a few seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);

    } catch (err) {
      console.error('Feedback submission error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <><Navbar /><div className="flex flex-col items-center justify-center min-h-screen bg-[#151122] p-4 font-inter">
      <div className="bg-[#2c2348] p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-white text-2xl font-bold mb-4 text-center">Share Your Thoughts</h2>
        <p className="text-[#a092c9] text-sm text-center mb-6">
          Your feedback helps us improve. Please rate your experience and leave any comments below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 5-Star Rating */}
          <div>
            <label className="block text-[#a092c9] text-sm font-medium mb-2">Rate Your Experience</label>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-8 h-8 cursor-pointer transition-colors duration-200
                    ${(hoverRating || rating) >= star ? 'text-[#5b2aed]' : 'text-[#3f3267]'}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 3.617 1.48-8.279L.001 9.306l8.332-1.151L12 .587z" />
                </svg>
              ))}
            </div>
          </div>

          {/* Optional Feedback Textarea */}
          <div>
            <label className="block text-[#a092c9] text-sm font-medium mb-2" htmlFor="feedbackText">
              What did you think of your simulation?
            </label>
            <textarea
              id="feedbackText"
              className="form-textarea w-full rounded-xl h-28 bg-[#3f3267] text-white focus:outline-none focus:ring-2 focus:ring-[#5b2aed] p-3 text-base font-normal leading-normal resize-y placeholder:text-[#a092c9]"
              placeholder="Optional feedback..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            ></textarea>
          </div>

          {/* Emoji Reactions */}
          <div>
            <label className="block text-[#a092c9] text-sm font-medium mb-2">Quick Reaction</label>
            <div className="flex justify-center space-x-3">
              {emojis.map((emojiItem) => (
                <button
                  key={emojiItem.value}
                  type="button" // Important to prevent form submission
                  className={`text-3xl p-2 rounded-full transition-all duration-200
                    ${selectedEmoji === emojiItem.value ? 'bg-[#5b2aed] scale-110' : 'hover:bg-[#3f3267]'}`}
                  onClick={() => setSelectedEmoji(selectedEmoji === emojiItem.value ? null : emojiItem.value)}
                >
                  {emojiItem.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#5b2aed] hover:bg-[#6c3bed] text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Sending Feedback...' : 'Send Feedback'}
            </button>
          </div>

          {/* Submission Confirmation/Error */}
          {isSubmitted && (
            <div className="text-center text-green-400 mt-4 animate-fade-in-out">
              Thank you for your feedback! ✨
            </div>
          )}

          {error && (
            <div className="text-center text-red-400 mt-4">
              Error: {error}
            </div>
          )}
        </form>
      </div>
    </div></>
  );
}

export default Feedback;
