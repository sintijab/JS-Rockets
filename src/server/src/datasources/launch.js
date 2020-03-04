const { RESTDataSource } = require('apollo-datasource-rest');
const { BASE_URL, EP_VERSION, EP_LAUNCHES, EP_PAST, NASA, PAYLOADS } = require('../constants');

class LaunchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `${BASE_URL}${EP_VERSION}`;
  }

  launchReducer(launch) {
    return {
      mission_name: launch.mission_name || ``,
      flight_number: launch.flight_number,
      rocket: {
        id: launch.rocket.rocket_id,
        stage: launch.rocket.second_stage,
      },
      date: new Date(launch.launch_date_utc)
    };
  }

  filterCustomers(payloads, customer) {
    return payloads.filter((payload) => !!payload.customers && payload.customers.indexOf(customer) !== -1);
  }

  queryReducer(response, query, customer, year) {
    let results = [];
    response.forEach((result) => {
      const launch = this.launchReducer(result);
      const payloads = launch.rocket.stage.payloads ? launch.rocket.stage.payloads : [];
      const hasQueryCustomers = payloads.length ? this.filterCustomers(payloads, customer) : [];
      const hasQueryYear = launch.date ? new Date(launch.date).getFullYear() === year : false;

      if (query === PAYLOADS && hasQueryCustomers.length && hasQueryYear) {
        results.push({
            flight_number: launch.flight_number,
            mission_name: launch.mission_name,
            payloads_amount: payloads.length,
            customer: customer,
            year: year,
            date: launch.date,
        });
      }
    });
    //sort results by descending amount of PAYLOADS and ascending DATE
    if (query === PAYLOADS) {
      results = results.sort((a, b) => {
        b.payloads_amount - a.payloads_amount || a.date - b.date;
      });
    }

    return results;
  }

  async getAllLaunches() {
    const response = await this.get(`${EP_LAUNCHES}${EP_PAST}`);
    return Array.isArray(response)
      ? response.map(launch => this.launchReducer(launch))
      : [];
  }

  async getLaunchBy({ query, customer, year }) {
    const response = await this.get(`${EP_LAUNCHES}${EP_PAST}`);
    if (Array.isArray(response)) {
      if (response.length) {
        return this.queryReducer(response, query, customer, year);
      }
      return [];
    }
  }
}

module.exports = LaunchAPI;
