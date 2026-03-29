import { reactive } from 'vue';

export interface Song {
    title: string;
    author: string;
    album: string;
    songmid: string;
    songid: number;
    pic: string;
    url: string;
}

export interface LyricLine {
    startTime: number;
    endTime: number;
    words: any[];
}

export const useMusicStore = () => {
    const state = reactive({
        playlist: [] as Song[],
        currentSongIndex: -1,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 0.5,
        playbackMode: 'sequential' as 'sequential' | 'random',
        lyrics: [] as any[],
        isLoadingLyrics: false,
        isPlaylistOpen: false,
    });

    const audio = new Audio();
    audio.volume = state.volume;

    // Sync state with audio events
    audio.addEventListener('timeupdate', () => {
        state.currentTime = audio.currentTime * 1000;
    });

    audio.addEventListener('durationchange', () => {
        state.duration = audio.duration * 1000;
    });

    audio.addEventListener('play', () => {
        state.isPlaying = true;
    });

    audio.addEventListener('pause', () => {
        state.isPlaying = false;
    });

    audio.addEventListener('ended', () => {
        next();
    });

    const fetchSongs = async () => {
        try {
            const { fetchSongs: fetchRawSongs } = await import('../lib/music');
            const data = await fetchRawSongs();
            state.playlist = data;
            if (state.playlist.length > 0 && state.currentSongIndex === -1) {
                state.currentSongIndex = Math.floor(Math.random() * state.playlist.length);
            }
        } catch (error) {
            console.error('Failed to fetch songs:', error);
        }
    };

    const fetchLyricsData = async (mid: string) => {
        state.lyrics = [];
        state.isLoadingLyrics = true;
        try {
            const { fetchLyrics: fetchRawLyrics, parseQrcData } = await import('../lib/music');
            const lyricsResponse = await fetchRawLyrics(mid);
            if (lyricsResponse) {
                state.lyrics = parseQrcData(lyricsResponse);
                console.log("Store: Lyrics loaded successfully", state.lyrics.length, "lines");
            }
        } catch (error) {
            console.error('Failed to fetch lyrics:', error);
            state.lyrics = [];
        } finally {
            state.isLoadingLyrics = false;
        }
    };

    const playSong = (index: number) => {
        if (index < 0 || index >= state.playlist.length) return;
        state.currentSongIndex = index;
        const song = state.playlist[index];
        audio.src = song.url;
        audio.play().catch(e => console.error('Audio playback failed:', e));
        fetchLyricsData(song.songmid);
    };

    const togglePlay = () => {
        if (state.isPlaying) {
            audio.pause();
        } else {
            if (!audio.src && state.playlist.length > 0) {
                playSong(Math.max(0, state.currentSongIndex));
            } else {
                audio.play().catch(e => console.error('Audio playback failed:', e));
            }
        }
    };

    const next = () => {
        if (state.playlist.length === 0) return;
        let nextIndex;
        if (state.playbackMode === 'random' && state.playlist.length > 1) {
            do {
                nextIndex = Math.floor(Math.random() * state.playlist.length);
            } while (nextIndex === state.currentSongIndex);
        } else {
            nextIndex = (state.currentSongIndex + 1) % state.playlist.length;
        }
        playSong(nextIndex);
    };

    const prev = () => {
        if (state.playlist.length === 0) return;
        let prevIndex;
        if (state.playbackMode === 'random' && state.playlist.length > 1) {
            do {
                prevIndex = Math.floor(Math.random() * state.playlist.length);
            } while (prevIndex === state.currentSongIndex);
        } else {
            prevIndex = (state.currentSongIndex - 1 + state.playlist.length) % state.playlist.length;
        }
        playSong(prevIndex);
    };

    const setVolume = (v: number) => {
        state.volume = v;
        audio.volume = v;
    };

    const togglePlaybackMode = () => {
        state.playbackMode = state.playbackMode === 'sequential' ? 'random' : 'sequential';
    };

    const seek = (timeMs: number) => {
        audio.currentTime = timeMs / 1000;
    };

    return {
        state,
        audio,
        fetchSongs,
        playSong,
        togglePlay,
        next,
        prev,
        seek,
        setVolume,
        togglePlaybackMode,
        togglePlaylist: () => { state.isPlaylistOpen = !state.isPlaylistOpen; }
    };
};

export const musicStore = useMusicStore();
