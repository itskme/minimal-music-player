const trackTitle = document.querySelector('#track-title');
const trackArtist = document.querySelector('#track-artist');
const coverArt = document.querySelector('#cover-art');
const playPauseButton = document.querySelector('#play-pause-button');
const nextButton = document.querySelector('#next-button');
const prevButton = document.querySelector('#prev-button');
const folderInput = document.querySelector('#folder-input');
const loadButton = document.querySelector('#load-button');
let currentTrack = 0;
let tracks = [];
let player = new Audio();

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

prevButton.addEventListener('click', () => {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  playTrack();
});

function playTrack() {
  if (tracks.length > 0) {
    player.src = URL.createObjectURL(tracks[currentTrack]);
    player.play();
    trackTitle.textContent = tracks[currentTrack].name;

    // Use jsmediatags to extract the metadata, try base64 for the image, it is not working rn
    jsmediatags.read(tracks[currentTrack], {
      onSuccess: (tag) => {
        trackArtist.textContent = tag.tags.artist || "Unknown Artist";
        if (tag.tags.picture) {
          const coverArtImage = new Image();
          coverArtImage.src = `data:image/jpeg;base64,${tag.tags.picture.data}`;
          coverArt.innerHTML = '';
          coverArt.appendChild(coverArtImage);
        } else {
          coverArt.innerHTML = '';
        }
      },
      onError: (error) => {
        console.error(error);
        trackArtist.textContent = "Unknown Artist";
        coverArt.innerHTML = '';
      }
    });

    playPauseButton.textContent = 'Pause';
  }
}