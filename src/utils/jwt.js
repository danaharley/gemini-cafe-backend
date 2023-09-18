import jwt from "jsonwebtoken";

export const signJwt = (payload, key, options) => {
  const privateKey = key;

  return jwt.sign(payload, privateKey, { ...(options && options) });
};

export const verifyJwt = (token, key) => {
  try {
    const privateKey = key;

    return jwt.verify(token, privateKey);
  } catch (error) {
    return null;
  }
};
