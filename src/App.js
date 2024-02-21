import React, { useState, useEffect } from "react"
import "./App.css"

function App() {
  const [playlist, setPlaylist] = useState([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1)

  useEffect(() => {
    // Load playlist from localStorage on component mount
    const savedPlaylist = JSON.parse(localStorage.getItem("playlist"))
    if (savedPlaylist) {
      setPlaylist(savedPlaylist)
      const lastPlayedIndex = localStorage.getItem("lastPlayedIndex")
      if (lastPlayedIndex !== null) {
        setCurrentTrackIndex(parseInt(lastPlayedIndex))
      }
    }
  }, [])

  useEffect(() => {
    // Save playlist to localStorage whenever it changes
    localStorage.setItem("playlist", JSON.stringify(playlist))
  }, [playlist])

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    const newTrack = { file, name: file.name }
    setPlaylist([...playlist, newTrack])
  }

  const handleTrackClick = (index) => {
    setCurrentTrackIndex(index)
  }

  const handleTrackEnded = () => {
    setCurrentTrackIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      if (nextIndex < playlist.length) {
        return nextIndex
      } else {
        return -1 // End of playlist
      }
    })
  }

  return (
    <div className="container">
      <h1 className="title">Audio Player</h1>
      <div className="file-input-wrapper">
        <input
          className="file-input"
          type="file"
          accept="audio/mp3"
          onChange={handleFileUpload}
        />
        <span>Upload Audio</span>
      </div>
      <div className="playlist-container">
        <h2 className="playlist-title">Playlist</h2>
        <ul className="playlist">
          {playlist.map((track, index) => (
            <li
              key={index}
              className={`playlist-item ${
                index === currentTrackIndex ? "active" : ""
              }`}
              onClick={() => handleTrackClick(index)}
            >
              {track.name}
            </li>
          ))}
        </ul>
      </div>
      {currentTrackIndex !== -1 && (
        <div className="now-playing-container">
          <h2 className="now-playing-title">Now Playing</h2>
          <div className="audio-player">
            <audio
              controls
              autoPlay
              src={URL.createObjectURL(playlist[currentTrackIndex].file)}
              onEnded={handleTrackEnded}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
