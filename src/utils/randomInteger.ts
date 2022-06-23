/**
 *
 * @param min inclusive upper bound
 * @param max exclusive upper bound
 * @returns
 */
export const randomInteger = (min: number, max: number) => {
  return Math.floor(
    Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min)
  );
};

/**
 *
 * @returns
 */
export const randomSingleDigit = () => {
  return randomInteger(0, 10);
};
