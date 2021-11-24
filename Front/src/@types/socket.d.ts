declare namespace socket {
  type AvailableMessengerRequestRoutes =
    | "Connect to chat page"
    | "Join room"
    | "Typing"
    | "Send message"
    | "Delete message";

  type AvailableMessengerResponseRoutes =
    | "onTyping"
    | "new chat"
    | "editing chat"
    | "selected room"
    | "new message"
    | "onDeletion";

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
    | "OK"
    | "Server Error"
    | "SQL Error"
    | "Unknown operation"
    | "Not Found";

  interface ISocketRequest<T, K> {
    operation: AvailableRequestRoutes;
    token: string;
    data: {
      requestFor: K;
      options: T;
    };
  }

  interface ISocketResponse<T, K> {
    operation: AvailableResponseRoutes;
    status: ResponseStatus;
    data: {
      requestFor: K;
      response: T;
    };
  }

  interface ISocketErrorResponse<T> {
    operation: AvailableResponseRoutes;
    status: ResponseStatus;
    data: {
      requestFor: T;
      response: string;
    };
  }
}
