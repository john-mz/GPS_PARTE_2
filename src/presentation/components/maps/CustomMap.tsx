import { useEffect, useState } from "react";
import {View, ViewProps, StyleSheet, Text, Pressable} from "react-native";
import type { LatLng } from "@/infrastructure/interfaces/lat-lng";
import OpenStreetMap from "./OpenStreetMap";
import {useLocationStore} from "@/presentation/store/useLocationStore";

interface Props extends ViewProps { initialLocation: LatLng, showUserLocation?: boolean }

export default function CustomMap ({ initialLocation: showUserLocation = true, ...rest }: Props){
    const [center, setCenter] = useState<LatLng>(initialLocation);
    const [following, setFollowing] = useState(false);
    const [gpsActivated, setGpsActivated] = useState(false);
    const [locationError, setLocationError] = useState(false);
    const { watchLocation, clearWatchLocation, lastKnownLocation, getLocation } = useLocationStore();

    useEffect(() => {
        if (!gpsActivated) return;
        let active = true;
        watchLocation().catch(() => {if (active) setLocationError(true)})
        return () => { active = false; clearWatchLocation();};
    }, [gpsActivated, watchLocation, clearWatchLocation]);

    useEffect(() => {
        if (gpsActivated && following && lastKnownLocation) setCenter(lastKnownLocation);
    }, [gpsActivated, following, lastKnownLocation]);

    const useGps = async () => {
        try {
            const position = await getLocation();
            setCenter(position);
            setGpsActivated(true);
            setFollowing(true);
            setLocationError(false);
        }catch {
            setLocationError(true);
        }
    }
}

const resetToDosquebradas = () => {
    setFollowing(false);
    setGpsActivated(false);
    setLocationError(false);
    ScreenStackHeaderCenterView(initialLocation);
}