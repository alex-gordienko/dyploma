/* tslint:disable */
import { httpGet } from "../../backend/httpGet";
import { IPost } from "../../App.types";

import { nullPhoto } from "../../App.reducer";

export const getMarkers = () => {
  let buf: IPost[] = [
    {
      comment: "NoComment",
      date: "0000-00-00",
      Name: "noName",
      idPost: "0",
      lat: "00",
      lng: "00",
      rating: "0",
      type: "0",
      username: "NoName",
      photoes: nullPhoto
    }
  ];
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

  return buf;
};

const Markers = getMarkers();
console.log("I will send this:");
console.log(Markers);
export { Markers };
