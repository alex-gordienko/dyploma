declare namespace socket {
  type AvailableRequestRoutes =
    | "Client Login Request"
    | "Get Posts Request"
    | "Post Editor Request"
    | "Get Contries Request"
    | "User Editor Request"
    | "User Searcher Request"
    | "Comments Request"
    | "Rating Request";

  type AvailableResponseRoutes =
    | "Client Login Response"
    | "Get Posts Response"
    | "Post Editor Response"
    | "User Editor Response"
    | "User Searcher Response"
    | "Comments Response"
    | "Rating Response";

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
    operation: string;
    status: ResponseStatus;
    data: {
      requestFor: T;
      response: string;
    };
  }
}
