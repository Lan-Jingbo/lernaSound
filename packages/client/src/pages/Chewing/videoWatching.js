import React, { useState } from 'react';
import YouTube from 'react-youtube';
import './videoWatching.css';

function VideoWatching() {
  const [videoId, setVideoId] = useState('');
  const [inputValue, setInputValue] = useState('');

  // Extract the video ID from the YouTube URL
  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const id = extractVideoId(inputValue);
    if (id) {
      setVideoId(id);
    } else {
      alert('Please enter a valid YouTube URL.');
    }
  };

  return (
    <div className="video-watching-container">
      <form onSubmit={handleSubmit} className="url-form">
        <input
          type="text"
          className="youtube-url-input"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter YouTube URL"
        />
        <button type="submit" className="load-video-button">Load Video</button>
      </form>
      {videoId && ( // Check that videoId is not empty
        <YouTube
          videoId={videoId} // Pass videoId to the YouTube component
          opts={{
            width: '1066.6666667',
            height: '600',
            playerVars: {
              autoplay: 1, // Autoplay the video
              controls: 1, // Show controls
            },
          }}
        />
      )}
    </div>
  );
}

export default VideoWatching;