import * as Location from "expo-location";
import { LatLng } from "@/infrastructure/interfaces/lat-lng";

export const getCurrentLocation = async(): Promise<LatLng> => {
    const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.highest
    })
    return {
        latitude: coords.latitude,
        longitude: coords.longitude
    }
}

export const watchCurrentPosition = (
    locationCallback: (location: LatLng) => void 
) => {
    return Location.watchPositionAsync(
        {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 1000,
            distanceInterval: 10
        },
        ({coords}) => {
            locationCallback({
                latitude: coords.latitude,
                longitude: coords.longitude
            })
        }
    )
}