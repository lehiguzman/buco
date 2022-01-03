export class PosicionGps {
    protected _lat: number;
    protected _lng: number;
    protected _address: string;
    constructor(lat: number, lng: number, address?: string) {
        this._lat = lat;
        this._lng = lng ;
        this._address = address || '';
    }
    get lat(): number {
        return this._lat;
    }
    set lat(lat: number) {
        this._lat = lat;
    }
    get lng(): number {
        return this._lng;
    }
    set lng(lng: number) {
        this._lng = lng;
    }
    get address(): string {
        return this._address;
    }
    set address(address: string) {
        this._address = address;
    }
}