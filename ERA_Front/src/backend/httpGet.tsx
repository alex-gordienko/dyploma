/* tslint:disable */
const adress = "http://10.15.0.9/dyploma/";
//const adress = "http://213.231.13.15/dyploma/";
export const chatServerAdress = "http://10.15.0.9:5001";

export function httpGet(url: string) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", adress + url, false);

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

export function httpPost(url: string, datatype: "string" | "json", data: any) {
  return new Promise(function(resolve, reject) {
    console.log("Connecting to: " + url);
    console.log("Sending next: " + data);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", adress + url, false);
    if (datatype === "string") {
      xhr.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
    } else if (datatype === "json") {
      xhr.setRequestHeader("Content-Type", "application/json");
    }
    xhr.onload = function() {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error("POST error"));
        }
      }
    };
    xhr.onerror = function(){

      reject("Network request Error");
    }
    xhr.send(data);
  });
}
