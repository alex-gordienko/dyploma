/* tslint:disable */
import React, {
  Component,
  useState,
  useEffect,
  useCallback,
  useReducer
} from "react";

import Cookies from "universal-cookie";
const cookie = new Cookies();

const nullUser: string =
  '{ "Country": "", ' +
  '"City": "",' +
  '"Birthday": "0000-00-00",' +
  '"FirstName": "NoName",' +
  '"LastName": "NoName",' +
  '"Status": "Empty",' +
  '"avatar": "null",' +
  '"email": "NoName@nomail.com",' +
  '"isBanned": false,' +
  '"isValid": true,' +
  '"regDate": "0000-00-00",' +
  '"Birthday": "0000-00-00",' +
  '"idUsers": 0,' +
  '"phone": 123455677888,' +
  '"rating": 0,' +
  '"username": "NoName",' +
  '"password": "NoPass" }';

export const saveStateInStorage = (
  name: "savedUser",
  lifeTime: number,
  data: string
) => {
  let d = new Date();
  console.log("saving in: ", name);
  console.log("saving this: ", data);
  try {
    cookie.set(name, JSON.stringify(data), {
      path: "/",
      maxAge: d.getTime() + lifeTime
    });
    console.log("State is Saved");
  } catch {
    // do nothing
  }
};
export const getStateFromStorage = (name: "savedUser") => {
  try {
    const result = cookie.get(name);
    console.log("From cookie '" + name + "': ", result);
    if (result === null || result === undefined) {
      return JSON.parse(nullUser);
    } else {
      return JSON.parse(result);
    }
  } catch (err) {
    console.log("Error in LocalStorage: ", err);
    return nullUser;
  }
};

export const deleteStateFromStorage = (name: "savedUser") => {
  try {
    cookie.remove(name);
  } catch (err) {
    console.error("Error on clearing cookie");
  }

  console.log("State is cleared");
};
