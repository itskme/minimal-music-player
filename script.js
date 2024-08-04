const trackTitle = document.querySelector('#track-title');
const trackArtist = document.querySelector('#track-artist');
const playPauseButton = document.querySelector('#play-pause-button');
const nextButton = document.querySelector('#next-button');
const prevButton = document.querySelector('#prev-button');
const folderInput = document.querySelector('#folder-input');
const loadButton = document.querySelector('#load-button');

let currentTrack = 0;
let tracks = [];

loadButton.addEventListener('click', () => {
  folderInput.click();
});

folderInput.addEventListener('change', (e) => {
  const files = e.target.files;
  tracks = Array.from(files).filter((file) => file.type.match('audio.*'));
  playTrack();
});

playPauseButton.addEventListener('click', () => {
  if (player.paused) {
    player.play();
    playPauseButton.textContent = 'Pause';
  } else {
    player.pause();
    playPauseButton.textContent = 'Play';
  }
});

nextButton.addEventListener('click', () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  playTrack();
});

