const musicPlayer = document.getElementById('musicPlayer');
if (musicPlayer) {
    const playPauseButton = musicPlayer.querySelector('button.play-pause');
    const prevButton = musicPlayer.querySelector('button.prev');
    const nextButton = musicPlayer.querySelector('button.next');
    const playIcon = playPauseButton.querySelector('.icon-play');
    const pauseIcon = playPauseButton.querySelector('.icon-pause');
    const audios = musicPlayer.querySelectorAll('audio');
    const audioTitles = musicPlayer.querySelectorAll('.audio-title');
    let isPlaying = false;
    let currentTrackIndex = 0;

    playPauseButton.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            audios[currentTrackIndex].play();
            audioTitles[currentTrackIndex].classList.remove('hidden');
        } else {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            audios[currentTrackIndex].pause();
            audioTitles[currentTrackIndex].classList.add('hidden');
        }
    });

    nextButton.addEventListener('click', () => {
        audios[currentTrackIndex].pause();
        audioTitles[currentTrackIndex].classList.add('hidden');
        currentTrackIndex = (currentTrackIndex + 1) % audios.length;
        
        
        audios[currentTrackIndex].play();
        audioTitles[currentTrackIndex].classList.remove('hidden');
        isPlaying = true;

        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    });

    prevButton.addEventListener('click', () => {
        audios[currentTrackIndex].pause();
        audioTitles[currentTrackIndex].classList.add('hidden');
        currentTrackIndex = (currentTrackIndex - 1 + audios.length) % audios.length;
        
        audios[currentTrackIndex].play();
        audioTitles[currentTrackIndex].classList.remove('hidden');
        isPlaying = true;

        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    });

}