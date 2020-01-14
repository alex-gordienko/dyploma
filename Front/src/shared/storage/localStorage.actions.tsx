/* tslint:disable */
import React, {
  Component,
  useState,
  useEffect,
  useCallback,
  useReducer
} from "react";

const nullUser: string =
  '{ "Birthday": "0000-00-00",' +
  '"FirstName": "NoName",' +
  '"LastName": "NoName",' +
  '"Status": "Empty",' +
  '"avatar": "null",' +
  '"email": "NoName@nomail.com",' +
  '"idUsers": 0,' +
  '"phone": 123455677888,' +
  '"rating": 0,' +
  '"username": "NoName" }';

export const saveStateInStorage = (user: JSON) => {
  console.log("saving this: ", user);
  try {
    localStorage.setItem("user", JSON.stringify(user));
    console.log("State is Saved");
  } catch {
    // do nothing
  }
};

export const getStateFromStorage = () => {
  try {
    const state: string | null = localStorage.getItem("user");
    if (state === null) {
      return JSON.parse(nullUser);
    } else {
      return JSON.parse(state);
    }
  } catch (err) {
    console.log("Error in LocalStorage: ", err);
    return nullUser;
  }
};

export const deleteStateFromStorage = () => {
  localStorage.removeItem("user");
  console.log("State is cleared");
};
