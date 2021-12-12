import React from "react";

export const getAge = (dob: string) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const birth = new Date(dob);
  const dobInThisYear = new Date(
    today.getFullYear(),
    birth.getMonth(),
    birth.getDate()
  );

  let Age = today.getFullYear() - birth.getFullYear();
  if (today < dobInThisYear) {
    Age -= 1;
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Nov",
    "Dec"
  ];
  const title =
    birth.getDate() +
    " " +
    months[birth.getMonth()] +
    " " +
    birth.getFullYear();
  return (
    <>
      <div title={title}>{Age} years</div>
    </>
  );
};
