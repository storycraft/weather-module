"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@akaiv/core");
const google_map_api_1 = require("./google-map-api");
const forecast_command_1 = require("./forecast-command");
const air_command_1 = require("./air-command");
class WeatherModule extends core_1.BotModule {
    constructor({ googleMapApiKey, darkSkyApiKey, airvisualApiKey }) {
        super();
        this.googleMapApi = new google_map_api_1.GoogleMapApi(googleMapApiKey);
        this.CommandManager.addCommand(new forecast_command_1.ForecastCommand(this.googleMapApi, darkSkyApiKey));
        this.CommandManager.addCommand(new air_command_1.AirCommand(this.googleMapApi, airvisualApiKey));
    }
    get Name() {
        return 'Weather';
    }
    get Description() {
        return '날씨 및 미세먼지 정보 제공';
    }
    get Namespace() {
        return 'sky';
    }
    get GoogleMapApi() {
        return this.googleMapApi;
    }
}
exports.WeatherModule = WeatherModule;
//# sourceMappingURL=weather-module.js.map