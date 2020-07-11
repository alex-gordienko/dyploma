import React, { useState, useEffect } from "react";

const defaultSettings = {
    enableHighAccuracy: false,
    timout: Infinity,
    maximumAge: 0
}

export const usePosition = async(watch=false, settings= defaultSettings) =>{
    const [position, setPosition] = useState({latitude:0, longtitude:0});
    const [error, setError] = useState(null);

    const onChange = ({coords, timestamp})=>{
        setPosition({
            latitude: coords.latitude,
            longtitude: coords.longtitude,
            accuracy: coords.accuracy,
            timestamp
        });
    };

    const onError = (error)=>{
        setError(error.message);
    }

    useEffect(()=>{
        const geo = navigator.geolocation;
        if(!geo){
            setError("Geolocation is not supported");
            return;
        }

        let watcher = null;
        if(watch){
            watcher = await geo.watchPosition(onChange, onError, settings);
        } else{
            await geo.getCurrentPosition(onChange, onError, settings);
        }
        return () => watcher && geo.clearWatch(watcher);
    }, [settings]);

    return {...position, error};
}