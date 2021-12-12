import fs from 'fs';
import { omit } from "lodash";
import OkPacket from "mysql2/typings/mysql/lib/protocol/packets/OkPacket";
import ResultSetHeader from "mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader";
import RowDataPacket from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";

export const parseData = <T>(
    data: RowDataPacket[]
        | RowDataPacket[][]
        | OkPacket
        | OkPacket[]
        | ResultSetHeader
) => JSON.parse(JSON.stringify(data)) as T;

export const getBaseFromFile = (file: string) => {
    const bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString('base64');
}

export const toDataPost = (rawPost: data.IRawPostData): data.IPost => ({
    ...omit(rawPost, ['lat', 'lng']),
    photoes: [],
    position: {
        lat: Number(rawPost.lat),
        lng: Number(rawPost.lng)
    },
    rating: {
        likes: 0,
        dislikes: 0,
        isLikedByMe: false,
        isDislikedByMe: false
    }
});

export const toApiSearchedUser = (rawUser: data.ISearchedUser): api.models.ISearchedUser => ({
    ...rawUser,
    rating: Number(rawUser.rating),
    idUsers: Number(rawUser.idUsers),
    isBanned: Boolean(rawUser.isBanned),
    isConfirm: Boolean(rawUser.isConfirm),
    isOnline: Boolean(rawUser.isOnline),
    isMyFriend: rawUser.isMyFriend ? Boolean(rawUser.isMyFriend) : undefined,
    isSubscribition: rawUser.isSubscribition ? Boolean(rawUser.isSubscribition) : undefined,
    isBlocked: rawUser.isBlocked ? Boolean(rawUser.isBlocked) : undefined,
});

export const tokenGen = (length: number) => {
  let rnd = "";
  while (rnd.length < length) {
    rnd += Math.random()
      .toString(36)
      .substring(2);
  }
  return rnd.substring(0, length);
};

export const formatDate = (date?: Date) => {
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