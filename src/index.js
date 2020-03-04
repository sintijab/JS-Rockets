import ApolloClient, { gql } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';
import { LOADING_TEXT, ERROR_TEXT, EMPTY_TEXT } from './constants';

export const client = new ApolloClient({
  fetch: fetch,
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache({
    addTypename: false
  })
});

const getLaunchByPayload = (client) => {
  document.getElementById('out').innerHTML = LOADING_TEXT;
  return (
  client
    .query({
      query: gql`
      {
        launchBy(param:"payloads" customer: "NASA" year: 2018) {
          flight_number
          mission_name
          payloads_amount
        }
      }
      `
    })
  )
}

getLaunchByPayload(client).then(({data}) => {
  if (data && data.launchBy && data.launchBy.length) {
    const output = JSON.stringify(data.launchBy, undefined, 2);
    return document.getElementById('out').innerHTML = output;
  }
  return document.getElementById('out').innerHTML = EMPTY_TEXT;
}).catch((err) => {
  document.getElementById('out').innerHTML = ERROR_TEXT;
  console.error(err);
})
