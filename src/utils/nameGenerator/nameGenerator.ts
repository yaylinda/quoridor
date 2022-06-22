import { ADJECTIVES } from "./adjectives";
import { NOUNS } from "./nouns";

const randomInt = (min: number, max: number): number => (Math.floor(Math.random() * (max - min)) + min);

const capitalize = (word: string): string => (word.charAt(0).toUpperCase() + word.slice(1));

export const generateName = () => {
  const randomAdj = ADJECTIVES[randomInt(0, ADJECTIVES.length + 1)];
  const randomNoun = NOUNS[randomInt(0, NOUNS.length + 1)];

  return `${capitalize(randomAdj)} ${capitalize(randomNoun)}`;
};

  