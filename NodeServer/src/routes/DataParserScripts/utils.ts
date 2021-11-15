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
        lat: rawPost.lat,
        lng: rawPost.lng
    },
    rating: {
        likes: 0,
        dislikes: 0,
        isLikedByMe: false,
        isDislikedByMe: false
    }
})