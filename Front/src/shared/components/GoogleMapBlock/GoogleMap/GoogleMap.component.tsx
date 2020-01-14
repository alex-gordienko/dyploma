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
import { IPost } from "../../../../App.types";

interface IGoogleMapProps {
  data?: IPost[];
  selectedMarker?: (id: number) => void;
  newPosition?: (lat: number, lng: number) => void;
}

const GoogleMapComponent = ({
  data,
  selectedMarker,
  newPosition
}: IGoogleMapProps) => {
  const [marker, newMarker] = useState({ lat: 0, lng: 0 });
  const resetMarker = useCallback(() => {
    selectedMarker!(0);
  }, []);

  const getPosition = (e: any) => {
    newMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    if (newPosition) newPosition(e.latLng.lat(), e.latLng.lng());
  };

  return data ? (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: 46.5792154, lng: 30.7951039 }}
      defaultOptions={{ styles: mapStyle }}
      onClick={resetMarker}
    >
      <MarkerClusterer>
        {data!.map(
          (item: {
            idPost: string;
            lat: string;
            lng: string;
            type: string;
          }) => {
            const { type, lat, lng, idPost } = item;
            const getSelectedMarker = useCallback(() => {
              selectedMarker!(parseInt(idPost));
            }, []);
            return (
              <Marker
                key={idPost}
                position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
                icon={{
                  url: type === "1" ? marker1 : marker2
                }}
                onClick={getSelectedMarker}
              />
            );
          }
        )}
      </MarkerClusterer>
    </GoogleMap>
  ) : (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: 46.5792154, lng: 30.7951039 }}
      defaultOptions={{ styles: mapStyle }}
      onClick={getPosition}
    >
      <Marker
        position={{ lat: marker.lat, lng: marker.lng }}
        icon={{ url: marker1 }}
      />
    </GoogleMap>
  );
};

GoogleMapComponent.defaultProps = {
  selectedMarker: () => void 0
};

export default withScriptjs(withGoogleMap(GoogleMapComponent));
