"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@akaiv/core");
class GoogleMapApi {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async getGeometryInfo(address) {
        let raw = await core_1.RequestHelper.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${this.apiKey}&language=ko&address=${encodeURI(address)}`);
        let rawData = JSON.parse(raw);
        let dataList = rawData['results'];
        let list = [];
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
exports.GoogleMapApi = GoogleMapApi;
//# sourceMappingURL=google-map-api.js.map