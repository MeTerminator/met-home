/**
 * Parse standard LRC format for translations
 */
const parseRawLrc = (lrc: string) => {
    if (!lrc) return [];
    const OFFSET_MS = -350;
    const regex = /^\[([^\]]+)\]\s*(.+?)\s*$/;
    return lrc.split("\n")
        .filter(line => regex.test(line))
        .map(line => {
            const match = line.match(regex);
            if (!match) return null;
            const [, time, text] = match;
            const parts = time.split(":");
            const minutes = parseInt(parts[0]);
            const seconds = parseFloat(parts[1]);
            const startTime = Math.max(0, (minutes * 60 + seconds) * 1000 + OFFSET_MS);
            return { startTime, text: text.trim() };
        })
        .filter((l): l is { startTime: number; text: string } => l !== null);
};

/**
 * Parse QRC format for AMLL based on test/parseLyric.js logic
 */
export const parseRawQrc = (qrc: string) => {
    if (!qrc) return [];
    try {
        const OFFSET_MS = -400;
        // Normalize qrc string according to test/parseLyric.js
        let processed = qrc.replace(/\r\n/g, "\n");

        // Safer offset handling than the test file's split
        const offsetPos = processed.indexOf("[offset:0]\n");
        if (offsetPos !== -1) {
            processed = processed.substring(offsetPos + "[offset:0]\n".length);
        }

        // Strip XML footer if present
        processed = processed.replace(/\n\"\/>\n<\/LyricInfo>\n<\/QrcInfos>/g, "");

        // Standardize word timing format ( (...) -> {...} )
        processed = processed.replace(/\((\d+,\d+)\)/g, '{$1}');

        const lines = processed.split("\n").slice(1);
        const parsedLines = lines.map(line => {
            const timeReg = /\[(\d+),(\d+)\]/;
            const timeMatch = line.match(timeReg);
            if (!timeMatch) return null;

            const rawStartTime = parseInt(timeMatch[1]);
            const rawEndTime = parseInt(timeMatch[2]);
            const startTime = Math.max(0, rawStartTime + OFFSET_MS);
            const endTime = Math.max(0, rawEndTime + OFFSET_MS);

            const contentText = line.replace(timeReg, "");
            if (!contentText) return null;

            // Split content into words with timings
            const wordParts = contentText.split(/([^}]*\{[0-9]\d*,[0-9]\d*\})/g)
                .filter(c => c && c.length > 0)
                .map(c => {
                    const wordTimeReg = /\{(\d+),(\d+)\}/;
                    const wordTimeMatch = c.match(wordTimeReg);
                    if (!wordTimeMatch) return null;

                    const wStart = parseInt(wordTimeMatch[1]);
                    const wDur = parseInt(wordTimeMatch[2]);
                    const word = c.replace(wordTimeReg, "");

                    return {
                        startTime: Math.max(0, wStart + OFFSET_MS),
                        endTime: Math.max(0, wStart + wDur + OFFSET_MS),
                        word: word,
                        romanWord: "",
                        obscene: false
                    };
                })
                .filter((w): w is any => w !== null);

            if (wordParts.length === 0) return null;

            // Remove info logic: If line has > 2 words and all words starting from 
            // the second one have identical durations, it's likely a metadata/info line.
            if (wordParts.length > 2) {
                const durations = wordParts.slice(1).map(w => w.endTime - w.startTime);
                const firstDur = durations[0];
                const allSame = durations.every(d => d === firstDur);
                if (allSame) return null;
            }

            return {
                startTime,
                endTime,
                words: wordParts,
                translatedLyric: "",
                romanLyric: "",
                isBG: false,
                isDuet: false
            };
        }).filter((l): l is any => l !== null);

        return parsedLines;
    } catch (e) {
        console.error("parseRawQrc failed:", e);
        return [];
    }
};

export const parseQrcData = (data: any) => {
    if (!data) return [];

    const mainLyrics = parseRawQrc(data.qrc || "");
    const transLyrics = parseRawLrc(data.qrctrans || ""); // Parsed as LRC per test/parseLyric.js
    const romaLyrics = parseRawQrc(data.qrcroma || ""); // Parsed as QRC per test/parseLyric.js

    // Set endTimes for main lyrics (stay on screen till next line)
    for (let i = 0; i < mainLyrics.length; i++) {
        if (i < mainLyrics.length - 1) {
            mainLyrics[i].endTime = mainLyrics[i + 1].startTime;
        }
    }

    // Alignment logic
    mainLyrics.forEach(m => {
        // Find matching translation (LRC)
        const tMatch = transLyrics.find(t => Math.abs(m.startTime - t.startTime) < 300);
        if (tMatch) {
            m.translatedLyric = tMatch.text;
        }

        // Find matching romanization (QRC)
        const rMatch = romaLyrics.find(r => Math.abs(m.startTime - r.startTime) < 300);
        if (rMatch) {
            m.romanLyric = ""; // AMLL handles at the word level usually, but we keep this empty or as a joined string

            // Word-level romanization alignment
            // If word counts match exactly between main line and roma line
            if (m.words.length === rMatch.words.length) {
                m.words.forEach((word: any, idx: number) => {
                    const originalWord = word.word.trim();
                    const rawRomanWord = rMatch.words[idx].word.trim();

                    // Case-insensitive check: only show if different from original word
                    // Also filter out "//" placeholder
                    if (rawRomanWord.toLowerCase() !== originalWord.toLowerCase() && rawRomanWord !== "//") {
                        word.romanWord = rawRomanWord;
                    } else {
                        word.romanWord = "";
                    }
                });
            }
        }
    });

    // Final sweep: remove "//" from line-level translations
    mainLyrics.forEach(m => {
        if (m.translatedLyric === "//") m.translatedLyric = "";
    });

    console.log("Final QRC Parse (ms):", mainLyrics);
    return mainLyrics;
};

export const fetchSongs = async () => {
    const response = await fetch('https://music.met6.top:444/openapi/likemusic.php');
    return await response.json();
};

export const fetchLyrics = async (mid: string) => {
    try {
        const response = await fetch(`https://music.met6.top:444/api/v1/lyric?mid=${mid}`);
        return await response.json();
    } catch (e) {
        console.error("fetchLyrics failed:", e);
        return null;
    }
};
