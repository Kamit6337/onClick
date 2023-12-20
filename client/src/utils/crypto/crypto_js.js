import CryptoJS from "crypto-js";
import environment from "../environment";

const secretKey = environment.CRYPTO_SECRET_KEY;

// Encryption function
export const encryptString = (text) => {
  const encrypted = CryptoJS.AES.encrypt(text, secretKey);
  return encrypted.toString();
};

// Decryption function
export const decryptString = (cipherText) => {
  const decrypted = CryptoJS.AES.decrypt(cipherText, secretKey);
  return decrypted.toString(CryptoJS.enc.Utf8);
};
