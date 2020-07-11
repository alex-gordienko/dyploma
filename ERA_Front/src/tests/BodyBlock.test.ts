/* tslint:disable */
import BodyBlock from "../shared/components/BodyBlock";
import { getMarkers } from "../shared/storage/GoogleMap.Markers";
import { IPost, IUser } from "../App.types";

import {
  saveStateInStorage,
  getStateFromStorage,
  deleteStateFromStorage
} from "../shared/storage/localStorage.actions";

import { sendData, getUserData, nullPhoto } from "../App.reducer";

let expectBuf: IPost[] = [
  {
    comment: "NoComment",
    date: "0000-00-00",
    Name: "NoName",
    idPost: "0",
    lat: "00",
    lng: "00",
    rating: "0",
    type: "0",
    username: "NoName",
    photoes: nullPhoto
  }
];

const nullUser = [
  {
    Birthday: "0000-00-00",
    FirstName: "NoName",
    LastName: "NoName",
    Status: "Empty",
    avatar: "null",
    email: "NoName@nomail.com",
    idUsers: 0,
    phone: 123455677888,
    rating: 0,
    username: "NoName"
  }
];

const goodUser = [
  {
    Birthday: "1999-04-12",
    FirstName: "Алексей",
    LastName: "Гордиенко",
    Status: "Живу так, словно у меня два сердца",
    avatar: null,
    email: "alexoid1999@gmail.com",
    idUsers: "1",
    phone: "380639383667",
    rating: "100",
    username: "alexoid1999"
  }
];

const response = getMarkers();

async function checkAuthorization(login: string, email: string, pass: string) {
  await deleteStateFromStorage();
  await console.log("Отправляю данные серверу: ");
  const formData =
    "login=" +
    encodeURIComponent(login) +
    "&email=" +
    encodeURIComponent(email) +
    "&pass=" +
    encodeURIComponent(pass);
  await sendData("login.php", "string", formData);
  await console.log("Получаю данные из хранилища: ");
  let result = await getUserData();
  await console.log("userData in localstorage: ", result);
  return result;
}

test("Тест №1. Проверка полученных данных на соответствие необходимому типу", () => {
  expect(typeof response).toBe(typeof expectBuf);
});

test("Тест №2. Тест цикла авторизации (успешный)", () => {
  checkAuthorization("alexoid1999", "q", "18ebyhwb").then(result => {
    expect(result).toEqual(goodUser);
  });
});

test("Тест №3. Тест цикла авторизации (Не успешный)", () => {
  checkAuthorization("asfth", "q", "srdtyhsrt").then(result => {
    expect(result).toEqual(nullUser);
  });
});
