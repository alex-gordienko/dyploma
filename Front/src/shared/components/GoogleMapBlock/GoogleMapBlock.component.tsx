/* tslint:disable */
import React from "react";
import GoogleMapComponent from "./GoogleMap";
import StyledMapBlock from "./GoogleMapBlock.styled";
import { IUserPosition } from "../../../App.types";

interface IGoogleMapBlockPostProps {
  mode: "Posts";
  data?: api.models.IPost[];
  aloneMarker?: api.models.IPost;
  selectedMarker?: (e: number) => void;
  newPosition?: (lat: number, lng: number) => void;
}

interface IGoogleMapBlockPeopleProps {
  mode: "People";
  data?: IUserPosition[];
}

type IGoogleMapProps = IGoogleMapBlockPostProps | IGoogleMapBlockPeopleProps;

const GoogleMapBlock = (action: IGoogleMapProps) => {
  return action.mode === "Posts" ? (
    <StyledMapBlock>
      <GoogleMapComponent
        mode={action.mode}
        data={action.data}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4un_JQsqJQTH7rDez7k9SJw7-zDyZ3YA&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `inherit`, width: `inherit` }} />}
        containerElement={
          <div style={{ height: `inherit`, width: `inherit` }} />
        }
        mapElement={<div style={{ height: `100%`, width: `inherit` }} />}
        selectedMarker={action.selectedMarker}
        aloneMarker={action.aloneMarker}
        newPosition={action.newPosition}
      />
    </StyledMapBlock>
  ) : (
    <StyledMapBlock>
      <GoogleMapComponent
        mode={action.mode}
        data={action.data}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4un_JQsqJQTH7rDez7k9SJw7-zDyZ3YA&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `inherit`, width: `inherit` }} />}
        containerElement={
          <div style={{ height: `inherit`, width: `inherit` }} />
        }
        mapElement={<div style={{ height: `100%`, width: `inherit` }} />}
      />
    </StyledMapBlock>
  );
};

export default GoogleMapBlock;
