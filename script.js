const trackTitle = document.querySelector('#track-title');
const trackArtist = document.querySelector('#track-artist');
const equalizerCanvas = document.querySelector('#equalizer-canvas');
const playPauseButton = document.querySelector('#play-pause-button');
const nextButton = document.querySelector('#next-button');
const prevButton = document.querySelector('#prev-button');
const folderInput = document.querySelector('#folder-input');
const loadButton = document.querySelector('#load-button');
let currentTrack = 0;
let tracks = [];
let player = new Audio();
let equalizerContext;
let audioContext;
let analyzer;

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

    // Use jsmediatags to extract the metadata
    jsmediatags.read(tracks[currentTrack], {
      onSuccess: (tag) => {
        const artist = tag.tags.artist || "Unknown Artist";
        trackArtist.textContent = artist;
      },
      onError: (error) => {
        console.error(error);
        trackArtist.textContent = "Unknown Artist";
      }
    });

    playPauseButton.textContent = 'Pause';

    // Create an audio context and analyzer
    audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(player);
    analyzer = audioContext.createAnalyser();
    source.connect(analyzer);
    analyzer.connect(audioContext.destination);
    analyzer.fftSize = 256;
    const frequencyData = new Uint8Array(analyzer.frequencyBinCount);

    // Draw the equalizer
    function drawEqualizer() {
      analyzer.getByteFrequencyData(frequencyData);
      equalizerContext.clearRect(0, 0, 100, 100);
      for (let i = 0; i < 10; i++) {
        const barHeight = Math.floor(frequencyData[i * 25] / 255 * 100);
        equalizerContext.fillStyle = `hsl(${i * 20}, 100%, 50%)`;
        equalizerContext.fillRect(i * 10, 100 - barHeight, 10, barHeight);
      }
      requestAnimationFrame(drawEqualizer);
    }
    drawEqualizer();
  }
}

equalizerCanvas.width = 100;
equalizerCanvas.height = 100;
equalizerContext = equalizerCanvas.getContext('2d');