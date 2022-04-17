import { Connection } from 'mysql2';
import { Socket } from 'socket.io';
declare class PostSetter {
    protected dbConnector: Connection;
    protected socket: Socket;
    protected readonly photoDirectory = "/srv/windows/dyploma/Photoes/";
    constructor(dbConnector: Connection, socket: Socket);
    createPost(operation: string, post: data.IPost): Promise<socket.ISocketErrorResponse<api.models.IAvailablePostActions>>;
    settingPhotoes(operation: string, postID: string, post: data.IPost): Promise<socket.ISocketErrorResponse<api.models.IAvailablePostActions>>;
    createComment(operation: string, data: api.models.ICreateCommentAction): Promise<socket.ISocketErrorResponse<api.models.IAvailablePostActions>>;
}
export default PostSetter;
//# sourceMappingURL=postSetter.d.ts.map