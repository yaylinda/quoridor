export const QUORIDOR_APP_COOKIE = 'QUORIDOR_APP_COOKIE';

export const generateCookie = () => {
    return `${randomLetter()}${randomLetter()}${randomLetter()}${randomInt()}${randomInt()}${randomInt()}`;
};

const randomInt = (min: number = 0, max: number = 10) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomLetter = () => {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1);
};