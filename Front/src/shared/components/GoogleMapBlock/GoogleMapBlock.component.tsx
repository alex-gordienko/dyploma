/* tslint:disable */
import React from "react";
import GoogleMapComponent from "./GoogleMap";
import StyledMapBlock from "./GoogleMapBlock.styled";
import { IPost } from "../../../App.types";

interface IGoogleMapBlockProps {
  data?: IPost[];
  selectedMarker?: (e: number) => void;
  newPosition?: (lat: number, lng: number) => void;
}

const GoogleMapBlock = ({
  data,
  selectedMarker,
  newPosition
}: IGoogleMapBlockProps) => {
  return (
    <StyledMapBlock>
      <GoogleMapComponent
        data={data}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4un_JQsqJQTH7rDez7k9SJw7-zDyZ3YA&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `inherit`, width: `inherit` }} />}
        containerElement={
          <div style={{ height: `inherit`, width: `inherit` }} />
        }
        mapElement={<div style={{ height: `100%`, width: `inherit` }} />}
        selectedMarker={selectedMarker}
        newPosition={newPosition}
      />
    </StyledMapBlock>
  );
};

export default GoogleMapBlock;
