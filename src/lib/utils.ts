export function isDesktop() {
  if (typeof window === 'undefined') return true;
  return window.innerWidth > 768;
}

export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export function getRandValues(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
