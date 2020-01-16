import { CommandInfo, BotCommandEvent, ModuleLogger } from "@akaiv/core";
import { GoogleMapApi } from "./google-map-api";
export declare class ForecastCommand implements CommandInfo {
    private googleMapApi;
    private darkSkyApiKey;
    constructor(googleMapApi: GoogleMapApi, darkSkyApiKey: string);
    readonly Description: string;
    readonly Usage: string;
    readonly CommandList: string[];
    getWeatherInfo(lat: number, lng: number): Promise<any>;
    onCommand(e: BotCommandEvent, logger: ModuleLogger): Promise<void>;
}
