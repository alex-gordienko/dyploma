declare namespace socket {
    type ResponseStatus =
        | 'OK'
        | 'Server Error'
        | 'SQL Error'
        | 'Unknown operation'
        | 'Not Found';

    interface ISocketRequest<T> {
        operation: string;
        token: string;
        data: T
    }

    interface ISocketResponse<T> {
        operation: string;
        status: ResponseStatus;
        result: T;
    }
}