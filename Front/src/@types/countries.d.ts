declare namespace api.models {
  type IAvailableCountriesActions = "Get Countries";

  interface ICountriesAndCities {
    country: Array<{
      id: number;
      name_en: string;
    }>;
    city: Array<{
      id: number;
      country_id: number;
      name_en: string;
    }>;
  }
}
