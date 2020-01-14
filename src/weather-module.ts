import { BotModule } from "@akaiv/core";
import { GoogleMapApi } from "./google-map-api";
import { ForecastCommand } from "./forecast-command";
import { AirCommand } from "./air-command";

/*
 * Created on Sat Oct 26 2019
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

export class WeatherModule extends BotModule {

    private googleMapApi: GoogleMapApi;

    constructor({ googleMapApiKey, darkSkyApiKey, airvisualApiKey }: { // ALways receive params as object
        googleMapApiKey: string,
        darkSkyApiKey: string
        airvisualApiKey: string
    }) {
        super();

        this.googleMapApi = new GoogleMapApi(googleMapApiKey);

        this.CommandManager.addCommand(new ForecastCommand(this.googleMapApi, darkSkyApiKey));
        this.CommandManager.addCommand(new AirCommand(this.googleMapApi, airvisualApiKey));
    }

    get Name() {
        return 'Weather'; // Module name
    }

    get Description() {
        return '날씨 및 미세먼지 정보 제공';
    }

    get Namespace() {
        return 'sky'; //This is used as command prefix `ex/{command}` and module id
    }

    get GoogleMapApi() {
        return this.googleMapApi;
    }

}