import { environment } from "../environment.js";

const generateString = (length = 25) => {
  const characters = environment.STRING_CHARACTERS;

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
};

export default generateString;
