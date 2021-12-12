/* tslint:disable */
//const adress = "http://10.15.0.9/5001/";
//const adress = "http://213.231.13.15/dyploma/";
export const ServerAdress = "http://10.15.0.91:5001";

export function httpGet(url: string) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", ServerAdress + url, false);

    xhr.onload = function() {
      if (this.status === 200) {
        resolve(this.response);
      } else {
        const error = new Error(this.statusText);
        reject(error);
      }
    };
    xhr.onerror = function() {
      reject(new Error("Network Error"));
    };
    xhr.send();
  });
}

export function sendToSocket<T, K>(
  socket: SocketIOClient.Socket,
  data: socket.ISocketRequest<T, K>
) {
  console.log("Connecting to: " + data.operation);
  console.log("Sending next: ", data);
  return socket.emit(data.operation, data);
}
