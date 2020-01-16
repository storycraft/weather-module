import { CommandInfo, BotCommandEvent, ModuleLogger } from "@akaiv/core";
import { GoogleMapApi } from "./google-map-api";
export declare class AirCommand implements CommandInfo {
    private googleMapApi;
    private airvisualApiKey;
    constructor(googleMapApi: GoogleMapApi, airvisualApiKey: string);
    readonly Description: string;
    readonly Usage: string;
    readonly CommandList: string[];
    getAirInfo(lat: number, lng: number): Promise<any>;
    onCommand(e: BotCommandEvent, logger: ModuleLogger): Promise<void>;
}
