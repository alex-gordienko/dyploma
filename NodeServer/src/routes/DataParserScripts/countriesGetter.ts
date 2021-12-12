import { Connection } from 'mysql2';
import { parseData } from './utils';

class CountriesGetter {
    protected dbConnector: Connection;

    constructor(dbConnector: Connection){
        this.dbConnector = dbConnector;
    }

    public async getCountriesAndCities(
    ): Promise<socket.ISocketResponse<api.models.ICountriesAndCities, api.models.IAvailableCountriesActions>>  {
        return new Promise(async (
            resolve: (value: socket.ISocketResponse<api.models.ICountriesAndCities, api.models.IAvailableCountriesActions>) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailableCountriesActions>) => void
        ) => {
            const getCountriesQuery = 'SELECT id, name_en FROM net_country';
            const getCitiesQuery = 'SELECT id, country_id, name_en FROM net_city';

            const getCountries = await this.dbConnector.promise().query(getCountriesQuery);
            const getCities = await this.dbConnector.promise().query(getCitiesQuery);

            const JSONCountries = parseData<api.models.ICountriesAndCities['country']>(getCountries[0]);
            const JSONCities = parseData<api.models.ICountriesAndCities['city']>(getCities[0]);

            if (JSONCountries.length && JSONCities.length) {
                resolve({
                    operation: 'Get Countries Response',
                    status: 'OK',
                    data: {
                        requestFor: 'Get Countries',
                        response: {
                            country: JSONCountries,
                            city: JSONCities
                        }
                    }
                })
            }
            reject({
                operation: 'Get Countries Response',
                status: 'Server Error',
                data: {
                    requestFor: 'Get Countries',
                    response: 'Can\'t Load Countries'
                }
            })
        })
    }

    
}


export default CountriesGetter