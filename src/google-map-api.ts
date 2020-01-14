import { RequestHelper } from "@akaiv/core";
import { WeatherModule } from "./weather-module";

/*
 * Created on Tue Jan 14 2020
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

export class GoogleMapApi {

    constructor(private apiKey: string) {

    }

    async getGeometryInfo(address: string): Promise<GeometryInfo[]> {
        let raw = await RequestHelper.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${this.apiKey}&language=ko&address=${encodeURI(address)}`);
        let rawData: any = JSON.parse(raw);

        let dataList: any[] = rawData['results'];

        let list: GeometryInfo[] = [];

        if (rawData['status'] !== 'OK') {
            list.push({
                status: rawData['status'],
    
                latitude: -1,
                longitude: -1
            });

            return list;
        }

        for (let data of dataList) {
            list.push({
                status: rawData['status'],
    
                latitude: data['geometry']['location']['lat'],
                longitude: data['geometry']['location']['lng'],
                formattedAddress: data['formatted_address']
            });
        }

        return list;
    }

}

export type GeometryInfo = {

    status: string

    latitude: number,
    longitude: number,

    formattedAddress?: string
    
}