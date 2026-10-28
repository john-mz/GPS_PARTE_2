import {useFonts} from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import PermissionsCheckerProvider from "@/presentation/providers/PermissionsCheckerProvider";
import { GestureHandlerRootView} from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout(){
    const [loaded] = useFonts({
        spaceMono: require("../assets/fonts/SpaceMono-Regulat.ttf"),
    })

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded){
        return null;
    }

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <PermissionsCheckerProvider>
                <Stack screenOptions={{headerShown: false}}>
                    <Stack.Screen name="loading/index" options={{animation: "none"}}></Stack.Screen>
                    <Stack.Screen name="map/index" options={{animation: "fade"}}></Stack.Screen>
                    <Stack.Screen name="permissions/index" options={{animation: "fade"}}></Stack.Screen>

                </Stack>
            </PermissionsCheckerProvider>
        </GestureHandlerRootView>
    )
}