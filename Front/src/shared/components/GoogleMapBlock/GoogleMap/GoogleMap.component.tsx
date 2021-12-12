/* tslint:disable */
import React, { useCallback, useState } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { mapStyle } from "./GoogleMap.Style";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";

import marker1 from "../../../../assets/icons/pencil.svg";
import marker2 from "../../../../assets/icons/search.svg";
import { IUserPosition } from "../../../../App.types";

interface IGoogleMapPostProps {
  mode: "Posts";
  data?: api.models.IPost[];
  aloneMarker?: api.models.IPost;
  selectedMarker?: (id: number) => void;
  newPosition?: (lat: number, lng: number) => void;
}

interface IGoogleMapPeopleProps {
  mode: "People";
  data?: IUserPosition[];
}

type IGoogleMapProps = IGoogleMapPostProps | IGoogleMapPeopleProps;

const GoogleMapComponent = (action: IGoogleMapProps) => {
  const [marker, newMarker] = useState(
    action.mode === "Posts"
      ? {
          lat: action.aloneMarker ? action.aloneMarker.position.lat : 0,
          lng: action.aloneMarker ? action.aloneMarker.position.lng : 0
        }
      : null
  );
  const resetMarker = useCallback(() => {
    if (action.mode === "Posts") action.selectedMarker!(0);
  }, []);

  const getPosition = (e: any) => {
    if (action.mode === "Posts") {
      newMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      if (action.newPosition)
        action.newPosition(e.latLng.lat(), e.latLng.lng());
    }
  };
  if (action.mode === "Posts") {
    return action.data ? (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 46.5792154, lng: 30.7951039 }}
        defaultOptions={{ styles: mapStyle }}
        onClick={resetMarker}
      >
        <MarkerClusterer>
          {action.data.map(
            (item: {
              idPost: number;
              position: {
                lat: number;
                lng: number;
              };
              type: number;
            }) => {
              const { type, position, idPost } = item;
              const getSelectedMarker = () => {
                action.selectedMarker!(idPost);
              };
              return (
                <Marker
                  key={idPost}
                  position={{ lat: position.lat, lng: position.lng }}
                  icon={{
                    url: type === 1 ? marker1 : marker2
                  }}
                  onClick={getSelectedMarker}
                />
              );
            }
          )}
        </MarkerClusterer>
      </GoogleMap>
    ) : action.aloneMarker ? (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{
          lat: action.aloneMarker.position.lat,
          lng: action.aloneMarker.position.lng
        }}
        defaultOptions={{ styles: mapStyle }}
        onClick={getPosition}
      >
        <Marker
          position={{ lat: marker!.lat, lng: marker!.lng }}
          icon={{ url: marker1 }}
        />
      </GoogleMap>
    ) : (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 46.5792154, lng: 30.7951039 }}
        defaultOptions={{ styles: mapStyle }}
        onClick={getPosition}
      >
        <Marker
          position={{ lat: marker!.lat, lng: marker!.lng }}
          icon={{ url: marker1 }}
        />
      </GoogleMap>
    );
  } else {
    const { data } = action;
    return data ? (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 46.5792154, lng: 30.7951039 }}
        defaultOptions={{ styles: mapStyle }}
      >
        {data.map(
          (item: {
            idUser: number;
            position: {
              lat: number;
              lng: number;
            };
          }) => {
            const { position, idUser } = item;
            return (
              <Marker
                key={idUser}
                position={{ lat: position.lat, lng: position.lng }}
                icon={{
                  url: marker1
                }}
              />
            );
          }
        )}
      </GoogleMap>
    ) : null;
  }
};

export default withScriptjs(withGoogleMap(GoogleMapComponent));
