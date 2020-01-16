import { BotModule } from "@akaiv/core";
import { GoogleMapApi } from "./google-map-api";
export declare class WeatherModule extends BotModule {
    private googleMapApi;
    constructor({ googleMapApiKey, darkSkyApiKey, airvisualApiKey }: {
        googleMapApiKey: string;
        darkSkyApiKey: string;
        airvisualApiKey: string;
    });
    readonly Name: string;
    readonly Description: string;
    readonly Namespace: string;
    readonly GoogleMapApi: GoogleMapApi;
}
