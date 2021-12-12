declare namespace api.models {
    interface IJoinRoomRequest {
        user: string;
        chatroom: string;
    }

    interface ISendMessageRequest {
        room: string;
        user: string;
        id_author: number;
        data: string;
        type: "text" | "postredirect";
    }
    
    interface IChat {
        chatID: string;
        avatar: string;
        type: string;
        name: string;
        messages: IMessage[];
        members: IMember[];
    }

    interface IMember {
        idUsers: number;
        username: string;
        rating: number;
        avatar: string;
    }

    interface IMessage {
        id: number;
        id_author: number;
        isHiddenFromAuthor: boolean;
        time: string;
        type: "text" | "postredirect";
        message: string | api.models.IPost;
    }

    interface IPreviewChat {
        avatar: string;
        chatID: string;
        type: string;
        name: string;
        lastMessage: IMessage | null;
        members: IMember[];
    }

}