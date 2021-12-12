export const tokenGen = (length: number) => {
  let rnd = "";
  while (rnd.length < length) {
    rnd += Math.random()
      .toString(36)
      .substring(2);
  }
  return rnd.substring(0, length);
};
