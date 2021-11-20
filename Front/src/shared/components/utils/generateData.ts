export const generateDate = (date?: Date) => {
  const d = date || new Date();
  const dateTime: string =
    d.getFullYear() +
    "-" +
    (d.getMonth() + 1) +
    "-" +
    d.getDate() +
    " " +
    d.getHours() +
    ":" +
    d.getMinutes() +
    ":" +
    d.getSeconds();
  return dateTime;
};
