export declare class GoogleMapApi {
    private apiKey;
    constructor(apiKey: string);
    getGeometryInfo(address: string): Promise<GeometryInfo[]>;
}
export declare type GeometryInfo = {
    status: string;
    latitude: number;
    longitude: number;
    formattedAddress?: string;
};
