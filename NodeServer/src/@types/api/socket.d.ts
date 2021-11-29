declare namespace socket {
  type AvailableMessengerRequestRoutes =
    | "Connect To Chat Page Request"
    | "Join Room Request"
    | "Chat Typing Request"
    | "Send Message Request"
    | "Delete Message Request"
    | "Create Chat Request"
    | "Edit Chat Request"
    | "Delete Chat Request";

  type AvailableMessengerResponseRoutes =
    | "Connect To Chat Page Response"
    | "Chat Typing Response"
    | "Create Chat Response"
    | "Edit Chat Response"
    | "Join Room Response"
    | "Send Message Response"
    | "Delete Message Response";
  
  type AvailableRequestRoutes =
    | "Client Login Request"
    | "Get Posts Request"
    | "Post Editor Request"
    | "Get Countries Request"
    | "User Editor Request"
    | "User Searcher Request"
    | "Comments Request"
    | "Rating Request"
    | AvailableMessengerRequestRoutes;

  type AvailableResponseRoutes =
    | "Client Login Response"
    | "Get Posts Response"
    | "Post Editor Response"
    | "Get Countries Response"
    | "User Editor Response"
    | "User Searcher Response"
    | "Comments Response"
    | "Rating Response"
    | AvailableMessengerResponseRoutes;
    
    type ResponseStatus =
        | 'OK'
        | 'Server Error'
        | 'SQL Error'
        | 'Unknown operation'
        | 'Not Found';

    interface ISocketRequest<T, K> {
        operation: AvailableRequestRoutes;
        token: string;
        data: {
            requestFor: K;
            options: T
        }
    }

    interface ISocketResponse<T, K> {
        operation: AvailableResponseRoutes;
        status: ResponseStatus;
        data: {
            requestFor: K;
            response: T
        }
    }

    interface ISocketErrorResponse<T> {
        operation: AvailableResponseRoutes;
        status: ResponseStatus;
        data: {
            requestFor: T;
            response: string;
        }
    }
}