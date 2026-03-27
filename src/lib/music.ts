/**
 * Parse QRC format for AMLL based on test/parseLyric.js logic
 */
export const parseQrcData = (data: any) => {
    if (!data || !data.qrc) return [];

    const parseRawQrc = (qrc: string) => {
        if (!qrc) return [];
        try {
            const OFFSET_MS = -350;
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

            const lines = processed.split("\n");
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

            // POST-PROCESS: Set line endTime to the startTime of the next line (if available)
            // This ensures lyrics stay on screen until the next one starts.
            for (let i = 0; i < parsedLines.length; i++) {
                if (i < parsedLines.length - 1) {
                    parsedLines[i].endTime = parsedLines[i + 1].startTime;
                }
            }

            return parsedLines;
        } catch (e) {
            console.error("parseRawQrc failed:", e);
            return [];
        }
    };

    const mainLyrics = parseRawQrc(data.qrc);
    const transLyrics = parseRawQrc(data.qrctrans);
    const romaLyrics = parseRawQrc(data.qrcroma);

    // Align translations and romanizations (based on parseOtherYrc alignment logic)
    const align = (main: any[], other: any[], name: 'translatedLyric' | 'romanLyric') => {
        if (!main.length || !other.length) return;
        main.forEach(m => {
            const match = other.find(o => Math.abs(m.startTime - o.startTime) < 100);
            if (match) {
                // Join all words from the matching line into the line-level field
                m[name] = match.words.map((w: any) => w.word).join("");

                // Also attempt word-level alignment for romanization if counts match
                if (name === 'romanLyric' && m.words.length === match.words.length) {
                    m.words.forEach((w: any, idx: number) => {
                        w.romanWord = match.words[idx].word;
                    });
                }
            }
        });
    };

    align(mainLyrics, transLyrics, 'translatedLyric');
    align(mainLyrics, romaLyrics, 'romanLyric');

    console.log("QRC Parse Result (ms, -250ms offset):", mainLyrics);
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
