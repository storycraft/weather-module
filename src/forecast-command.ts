import { CommandInfo, RequestHelper, BotCommandEvent, ModuleLogger } from "@akaiv/core";
import { GoogleMapApi, GeometryInfo } from "./google-map-api";

/*
 * Created on Tue Jan 14 2020
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

const ICON_DESCRIPTION: any = {
    'clear-day': '맑음',
    'clear-night': '맑음',
    'rain': '비 내림',
    'snow': '눈 내림',
    'sleet': '진눈깨비가 날림',
    'wind': '바람',
    'fog': '안개',
    'cloudy': '구름 낌',
    'partly-cloudy-day': '약간 구름 낌',
    'partly-cloudy-night': '약간 구름 낌'
}

const PRECIP_DESCRIPTION: any = {
    'rain': '비',
    'snow': '눈',
    'sleet': '진눈깨비'
}

export class ForecastCommand implements CommandInfo {

    constructor(private googleMapApi: GoogleMapApi, private darkSkyApiKey: string) {

    }

    get Description() {
        return '이불 밖은 위험해요. ㄷㄷ';
    }

    get Usage() {
        return 'sky/info <지역명>';
    }

    get CommandList() {
        return ['info', 'weather'];
    }

    async getWeatherInfo(lat: number, lng: number): Promise<any> {
        let data = await RequestHelper.get(`https://api.darksky.net/forecast/${this.darkSkyApiKey}/${lat},${lng}?exclude=minutely,hourly,daily,alerts,flags&units=si`);

        return JSON.parse(data);
    }

    async onCommand(e: BotCommandEvent, logger: ModuleLogger) {
        if (e.RawArgument.length < 1) {
            e.Channel.sendText('적절한 사용법: ' + this.Usage);
            return;
        }
        
        e.Channel.sendText('날씨 데이터 받아오는중...');

        let geoInfoList;
        
        try {
            geoInfoList = (await this.googleMapApi.getGeometryInfo(e.RawArgument));
        } catch(e) {
            e.Channel.sendText(`위치정보를 받아오는 도중 오류가 발생했습니다.`);
            logger.error(`Error while requesting place geocode. place: ${e.RawArgument}. ${e}`);
            return;
        }

        let geoInfo = geoInfoList.shift()!;

        switch (geoInfo['status']) {

            case 'ZERO_RESULTS':
                e.Channel.sendText(`${e.RawArgument} - 를 찾을수가 없어요 ㅜㅜ;`);
                break;
            
            case 'OK':
                try {
                    let weatherJson = await this.getWeatherInfo(geoInfo.latitude, geoInfo.longitude);

                    let currentWeather = weatherJson['currently'];

                    //텍스트공백 제거
                    let infoText = `${geoInfo.formattedAddress || e.RawArgument} 의 현재 날씨\n\n${ICON_DESCRIPTION[currentWeather['icon']] || '알수 없음'}\n${currentWeather['summary']}\n\n`;
                    infoText += `현재 온도: ${currentWeather['temperature']} °C, 체감 온도: ${currentWeather['apparentTemperature']} °C\n습도: ${(currentWeather['humidity'] * 100).toFixed(2)} %, 자외선 지수: ${currentWeather['uvIndex']}\n풍속: ${currentWeather['windSpeed']} m/s`;

                    if (currentWeather['visibility'])
                        infoText += `, 가시 거리: ${currentWeather['visibility']} km`;
                    
                    if (currentWeather['precipType'])
                        infoText += `\n${PRECIP_DESCRIPTION[currentWeather['precipType']]} 이(가) 내릴 확률 ${(currentWeather['precipProbability'] * 100).toFixed(2)} %`;
                    
                    if (currentWeather['pressure'])
                        infoText += `\n기압 : ${currentWeather['pressure']} hPa`;

                    if (currentWeather['ozone'])
                        infoText += `\n오존 : ${currentWeather['ozone']} DU`;

                    //Powered by text
                    infoText += '\n\nPowered by Dark Sky https://darksky.net/poweredby/'

                    e.Channel.sendText(infoText);
                } catch(e) {
                    e.Channel.sendText(`기상정보를 받아오는 도중 오류가 발생했습니다.`);
                    logger.error(`Error while receving forecast. place: ${geoInfo.formattedAddress || e.RawArgument}. ${e}`);
                }

                break;

            case 'OVER_QUERY_LIMIT':
                e.Channel.sendText('요청가능 할당량이 초과 되었습니다');
                break;

            case 'REQUEST_DENIED':
                e.Channel.sendText('요청이 거부되었습니다(?)');
                break;

            case 'INVALID_REQUEST':
                e.Channel.sendText('뭔 지거리를 하는거야');
                break;

            case 'UNKNOWN_ERROR':
                e.Channel.sendText('알수없는 오류가 발생했습니다');
                break;

            default:
                break;
        }
    }
}