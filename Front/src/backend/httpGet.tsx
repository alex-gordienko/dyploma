/* tslint:disable */
//const adress = "http://10.15.0.9/5001/";
//const adress = "http://213.231.13.15/dyploma/";
export const ServerAdress = "http://10.15.0.9:5001";

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

export function httpPost(
  socket: SocketIOClient.Socket,
  command: string,
  data: any
) {
  console.log("Connecting to: " + command);
  console.log("Sending next: ", data);
  return socket.emit(command, data);
}
