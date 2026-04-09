import { useState, useEffect } from 'react';

const useGeolocation = () => {
    const [location, setLocation] = useState({
        loaded: false,
        coordinates: { lat: "", lng: "" },
        error: null
    });

    const onSuccess = (location) => {
        setLocation({
            loaded: true,
            coordinates: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            },
            error: null
        });
    };

    const onError = (error) => {
        setLocation({
            loaded: true,
            coordinates: { lat: "", lng: "" },
            error: error.message,
        });
    };

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            onError({ message: "Geolocation not supported" });
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }, []);

    return location;
};

export default useGeolocation;
