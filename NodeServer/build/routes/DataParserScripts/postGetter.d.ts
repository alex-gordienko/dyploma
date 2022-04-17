import { Connection } from 'mysql2';
import { Socket } from 'socket.io';
import User from './userGetter';
declare class PostGetter {
    protected dbConnector: Connection;
    protected socket: Socket;
    protected readonly photoDirectory = "/srv/windows/dyploma/Photoes/";
    constructor(dbConnector: Connection, socket: Socket);
    getAllPosts(requestedOperation: string, postIDs: number[], pageSize?: number): Promise<data.IPost[]>;
    getUserPublicPosts(requestedOperation: string, username: string, postIDs: number[], pageSize?: number): Promise<data.IPost[]>;
    getUserPrivatePosts(requestedOperation: string, username: string, postIDs: number[], pageSize?: number): Promise<data.IPost[]>;
    getLikes(post: data.IPost, user: User): Promise<data.IPost>;
    getDisLikes(post: data.IPost, user: User): Promise<data.IPost>;
    getPhotoes(post: data.IPost): Promise<data.IPost>;
    getComments(postID: number): Promise<data.IPostComment[]>;
    getIDPost(operation: string, postName: string, date: string, idUser: number): Promise<string>;
}
export default PostGetter;
//# sourceMappingURL=postGetter.d.ts.map