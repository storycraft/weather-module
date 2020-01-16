"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@akaiv/core");
const UNITS = {
    "p2": "ugm3",
    "p1": "ugm3",
    "o3": "ppb",
    "n2": "ppb",
    "s2": "ppb",
    "co": "ppm"
};
class AirCommand {
    constructor(googleMapApi, airvisualApiKey) {
        this.googleMapApi = googleMapApi;
        this.airvisualApiKey = airvisualApiKey;
    }
    get Description() {
        return '??: 미세먼지 마셔서 없애자';
    }
    get Usage() {
        return 'sky/air <지역명>';
    }
    get CommandList() {
        return ['air'];
    }
    async getAirInfo(lat, lng) {
        let data = await core_1.RequestHelper.get(`https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lng}&key=${this.airvisualApiKey}`);
        return JSON.parse(data);
    }
    async onCommand(e, logger) {
        if (e.RawArgument.length < 1) {
            e.Channel.sendText('사용법: ' + this.Usage);
            return;
        }
        let geoInfoList;
        try {
            geoInfoList = (await this.googleMapApi.getGeometryInfo(e.RawArgument));
        }
        catch (e) {
            e.Channel.sendText(`위치정보를 받아오는 도중 오류가 발생했습니다.`);
            logger.error(`Error while requesting place geocode. place: ${e.RawArgument}. ${e}`);
            return;
        }
        let geoInfo = geoInfoList.shift();
        switch (geoInfo['status']) {
            case 'ZERO_RESULTS':
                e.Channel.sendText(`${e.RawArgument} - 를 찾을수가 없어요 ㅜㅜ;`);
                break;
            case 'OK':
                let data = await this.getAirInfo(geoInfo.latitude, geoInfo.longitude);
                try {
                    let currentPollution = data['data']['current']['pollution'];
                    let infoText = `${geoInfo.formattedAddress || e.RawArgument}의 미세먼지 정보\n\n`;
                    infoText += `AQI: ${currentPollution['aqius']} (${UNITS[currentPollution['mainus']]})`;
                    infoText += `\n\nPowered by Airvisual`;
                    e.Channel.sendText(infoText);
                }
                catch (ex) {
                    logger.error(`Error while requesting air data. place: ${e.RawArgument}, status: ${data['status']}. ${ex}`);
                    e.Channel.sendText(`Airvisual API 요청이 실패 했습니다.`);
                    return;
                }
                break;
            default:
                e.Channel.sendText(`API 요청이 실패 했습니다. ${geoInfo['status']}`);
                break;
        }
    }
}
exports.AirCommand = AirCommand;
//# sourceMappingURL=air-command.js.map