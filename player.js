// Global Player Manager - Shared across all pages
class PhonkPlayer {
  constructor() {
    this.audio = new Audio();
    this.currentSongIndex = null;
    this.currentSongName = null;
    this.currentSongFile = null;
    this.isPlaying = false;
    this.loopEnabled = false;
    this.allSongs = [];
    this.isFavoritesMode = false;
    
    this.restoreState();
    this.setupAudioListeners();
  }

  setupAudioListeners() {
    this.audio.addEventListener('ended', () => {
      if (!this.loopEnabled) {
        this.playNext();
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      this.broadcastProgress();
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.saveState();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.saveState();
    });
  }

  setVolume(vol) {
    this.audio.volume = vol;
  }

  setCurrentTime(time) {
    this.audio.currentTime = time;
  }

  saveState() {
    sessionStorage.setItem('phonkPlayer', JSON.stringify({
      currentSongIndex: this.currentSongIndex,
      currentSongName: this.currentSongName,
      currentSongFile: this.currentSongFile,
      isPlaying: this.isPlaying,
      currentTime: this.audio.currentTime,
      loopEnabled: this.loopEnabled,
      isFavoritesMode: this.isFavoritesMode
    }));
  }

  restoreState() {
    const saved = sessionStorage.getItem('phonkPlayer');
    if (saved) {
      const state = JSON.parse(saved);
      this.currentSongIndex = state.currentSongIndex;
      this.currentSongName = state.currentSongName;
      this.currentSongFile = state.currentSongFile;
      this.isPlaying = state.isPlaying;
      this.loopEnabled = state.loopEnabled;
      this.isFavoritesMode = state.isFavoritesMode;
      
      if (this.currentSongFile) {
        this.audio.src = this.currentSongFile;
        this.audio.currentTime = state.currentTime || 0;
        if (this.isPlaying) {
          this.audio.play().catch(err => console.warn('Play failed:', err));
        }
      }
    }
  }

  play(songFile, songName, songIndex, isFavorite = false) {
    if (this.audio.src !== songFile) {
      this.audio.src = songFile;
      this.currentSongFile = songFile;
      this.currentSongName = songName;
      this.currentSongIndex = songIndex;
      this.isFavoritesMode = isFavorite;
    }
    
    this.audio.play().catch(err => console.warn('Play failed:', err));
    this.isPlaying = true;
    this.audio.loop = this.loopEnabled;
    this.saveState();
    this.broadcastPlayerUpdate();
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.saveState();
    this.broadcastPlayerUpdate();
  }

  togglePause() {
    if (this.isPlaying) {
      this.pause();
    } else if (this.currentSongFile) {
      this.audio.play().catch(err => console.warn('Play failed:', err));
      this.isPlaying = true;
      this.saveState();
      this.broadcastPlayerUpdate();
    }
  }

  playNext() {
    // Implement in page-specific code
    window.dispatchEvent(new CustomEvent('phonk-play-next'));
  }

  playPrevious() {
    // Implement in page-specific code
    window.dispatchEvent(new CustomEvent('phonk-play-previous'));
  }

  toggleLoop() {
    this.loopEnabled = !this.loopEnabled;
    this.audio.loop = this.loopEnabled;
    this.saveState();
    this.broadcastPlayerUpdate();
  }

  setSongs(songs) {
    this.allSongs = songs;
  }

  broadcastProgress() {
    const progress = (this.audio.currentTime / (this.audio.duration || 1)) * 100;
    window.dispatchEvent(new CustomEvent('phonk-progress', {
      detail: {
        currentTime: this.audio.currentTime,
        duration: this.audio.duration,
        progress: isNaN(progress) ? 0 : progress
      }
    }));
  }

  broadcastPlayerUpdate() {
    window.dispatchEvent(new CustomEvent('phonk-player-update', {
      detail: {
        currentSongName: this.currentSongName,
        isPlaying: this.isPlaying,
        loopEnabled: this.loopEnabled
      }
    }));
  }
}

// Global instance
window.phonkPlayer = new PhonkPlayer();
