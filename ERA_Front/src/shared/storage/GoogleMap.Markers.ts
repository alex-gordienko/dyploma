/* tslint:disable */
import { httpGet, httpPost } from "../../backend/httpGet";
import { IPost } from "../../App.types";

import { nullPhoto } from "../../App.reducer";
import defaultAvatar from '../../assets/img/DefaultPhoto.jpg'

export const getMarkers = (userName?:string, idPost?:number) => {
  let buf: IPost[] = [];
  if(userName){
    const formData = "user=" + encodeURIComponent(userName);
    httpPost("getPosts.php","string", formData)
    .then(
      (response: any) => {
        const data = JSON.parse(response);
        console.log("I get this from server:");
        console.log(data);
        return data;
      },
      error => alert(`Rejected: ${error}`)
    )
    .then((data: any) => {
      buf.splice(0, 1);
      if(data !=="No Results Found."){
        data.map((row: any) => {
          buf.push(row);
        });
      }
    });
  }
  else if(idPost){
    const formData = "idPost=" + encodeURIComponent(idPost);
    httpPost("getPosts.php","string", formData)
    .then(
      (response: any) => {
        const data = JSON.parse(response);
        console.log("I get this from server:");
        console.log(data);
        return data;
      },
      error => alert(`Rejected: ${error}`)
    )
    .then((data: any) => {
      buf.splice(0, 1);
      if(data !=="No Results Found."){
        data.map((row: any) => {
          buf.push(row);
        });
      }
    });
  }
  else{
    httpGet("getPosts.php")
    .then(
      (response: any) => {
        const data = JSON.parse(response);
        console.log("I get this from server:");
        console.log(data);
        return data;
      },
      error => alert(`Rejected: ${error}`)
    )
    .then((data: any) => {
      buf.splice(0, 1);
      data.map((row: any) => {
        buf.push(row);
      });
    });
  }
  return buf;
};

const Markers = getMarkers();
console.log("I will send this:");
console.log(Markers);
export { Markers };
