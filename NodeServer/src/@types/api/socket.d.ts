declare namespace socket {
    type AvailableRequestRoutes =
        | 'Client Login Request'
        | 'Get Posts Request'
        | 'User Editor Request';

    type AvailableResponseRoutes =
        | 'Client Login Response'
        | 'Get Posts Response'
        | 'Post Editor Response'
        | 'User Editor Response';
    
    
    type ResponseStatus =
        | 'OK'
        | 'Server Error'
        | 'SQL Error'
        | 'Unknown operation'
        | 'Not Found';

    interface ISocketRequest<T> {
        operation: AvailableRequestRoutes;
        token: string;
        data: {
            requestFor: string;
            options: T
        }
    }

    interface ISocketResponse<T> {
        operation: AvailableResponseRoutes;
        status: ResponseStatus;
        data: {
            requestFor: string;
            response: T
        }
    }

    interface ISocketErrorResponse {
        operation: string;
        status: ResponseStatus;
        result: string;
    }
}