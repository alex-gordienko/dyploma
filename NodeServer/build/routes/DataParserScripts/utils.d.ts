import OkPacket from "mysql2/typings/mysql/lib/protocol/packets/OkPacket";
import ResultSetHeader from "mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader";
import RowDataPacket from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";
export declare const parseData: <T>(data: RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader) => T;
export declare const getBaseFromFile: (file: string) => string;
export declare const toDataPost: (rawPost: data.IRawPostData) => data.IPost;
//# sourceMappingURL=utils.d.ts.map