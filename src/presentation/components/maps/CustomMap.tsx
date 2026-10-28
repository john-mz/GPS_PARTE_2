import { useEffect, useState } from "react";
import {View, ViewProps, StyleSheet, Text, Pressable} from "react-native";
import type { LatLng } from "@/infrastructure/interfaces/lat-lng";
import OpenStreetMap from "./OpenStreetMap";
import {useLocationStore} from "@/presentation/store/useLocationStore";
import { reset } from "expo-router/build/react-navigation/routers/CommonActions";

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

return (
    <View {...reset} style={[styles.container, rest.style]}>
        <OpenStreetMap key={`${center.latitude.toFixed(5)}:${center.longitud.toFixed(5)}:${following}`} center={center} onUserPan={() => setFollowing(false)}></OpenStreetMap>
        <View style={styles.info}>
            <Text style={styles.heading}>{gpsActivated ? "Ubicacion del dispositivo" : "Inicio: Dosquebradas"}</Text>
            <Text>Lat: {center.latitude.toFixed(5) | Lon: {center.longitude.toFixed(5)}}</Text>
            <Text style={styles.small}>{gpsActivated ? (following ? "Seguimiento GPS activo" : "Seguimiento pausado") : "Ubicacion de ejemplo: no es el GPS"}</Text>
            {locationError && <Text style={styles.error}>GPS no disponible. Revisa los permisos y la ubicacion simulada.</Text>}
        </View>
        <View style={styles.controls}>
            <Pressable accessibilityRole="button" style={styles.button} onPress={() => void useGps()}>
                <Text style={styles.buttonText}>usar mi GPS</Text>
            </Pressable>
            {gpsActivated && (
                <Pressable accessibilityRole="button" style={styles.button} onPress={() => setFollowing(!following)}>
                    <Text style={styles.buttonText}>{following ? "Pausar seguimiento" : "seguir GPS"}</Text>
                </Pressable>
            )}
            <Pressable accessibilityRole="button" style={styles.button} onPress={resetToDosquebradas}>
                <Text style={styles.buttonText}>volver a Dosquebradas</Text>
            </Pressable>
        </View>
    </View>
)

const styles = StyleSheet.create({
    container: {flex: 1},
    info: {position: "absolute", top: 12, left: 12, right: 12, backgroundColor: "white", padding: 12, borderRadius: 10, elevation: 3},
    heading: {fontSize: 16, fontWeight: "bold", color: "#173f73", marginBottom: 4},
    small: {fontSize: 12, marginTop: 4, color: "#444"},
    error: {color: "#b91c1c", marginTop: 5},
    controls: {position: "absolute", bottom: 28, left: 14, right: 14, alignItems: "flex-end", gap: 8},
    button: {paddingHorizontal: 15, paddingVertical: 12, borderRadius:9, backgroundColor: "#173f73", elevation: 3},
    buttonText: {color: "white", fontSize: 14, fontWeight: "600"}
})