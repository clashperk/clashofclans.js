import type { APILocation } from '../types';

/**
 * Represents a Clash of Clans Location.
 */
export class Location {
    /**
     * The location Id.
     */
    public id: number;

    /**
     * The location name.
     */
    public name: string;

    /**
     * A localized name of the location.
     */
    public localizedName: string | null;

    /**
     * Indicates whether the location is a country.
     */
    public isCountry: boolean;

    /**
     * The country code of the location.
     */
    public countryCode: string | null;

    public constructor(data: APILocation) {
        this.id = data.id;
        this.name = data.name;
        this.localizedName = data.localizedName ?? null;
        this.isCountry = data.isCountry;
        this.countryCode = data.countryCode ?? null;
    }
}
