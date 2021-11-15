import mysql from 'mysql2';
export declare const connectDB: () => Promise<mysql.Connection | null>;
export declare const closeConnectionDB: (connection: mysql.Connection) => void;
//# sourceMappingURL=index.d.ts.map