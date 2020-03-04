const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require("apollo-server");
const payload = require("../../../fixtures/payload.json");
const output = require("../../../fixtures/output.json");
const LaunchAPI = require("../src/datasources/launch");
const typeDefs = require('../src/schema');
const resolvers = require('../src/resolvers');

const {
  makeExecutableSchema,
  addMockFunctionsToSchema
} = require('graphql-tools');
const { graphql } = require('graphql');

describe(`Server`, () => {
  const schemaString = `
    scalar Date
    type Payloads { payload_id: ID!}
    type SecondStage { payloads: [Payloads]}
    type Rocket { stage: SecondStage}
    type Launch {
      flight_number: Int,
      mission_name: String,
      rocket: Rocket, date: Date,
      payloads_amount: Int,
      customer: String,
      year: Int
    }
    type Query {
      launches: [Launch],
      launch(id: Int): Launch,
      launchBy(param: String, customer: String, year: Int): [Launch]
    }
  `;
  const launchAPI = new LaunchAPI();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({ launchAPI }),
  });

  it(`fetches amout of launch by descending payload amount and returns flight number, mission name and payloads amout`, async () => {
    const launchByQuery = `
    {
      launchBy(param:"payloads" customer:"NASA" year:2018) {
        flight_number
        mission_name
        payloads_amount
      }
    }
    `
    const { query } = createTestClient(server);
    const response = await query({ query: launchByQuery });
    expect(response).toMatchSnapshot();
  })

  it(`returns flight number, mission name and payloads data by applied graph queries`, async () => {
    const launchByQuery = `
    {
      launchBy(param:"payloads" customer:"NASA" year:2018) {
        flight_number
        mission_name
        payloads_amount
      }
    }
    `
    const { query } = createTestClient(server);
    const response = await query({ query: launchByQuery });
    JSON.parse = jest.fn().mockImplementationOnce(() => response);
    expect(JSON.parse(response).data.launchBy).toEqual(output)
  })

  it(`fetches all launches with property values of applied queries`, async () => {
    const launchQuery = `
    {
      launches {
        flight_number
        mission_name
        date
      }
    }
    `

    const { query } = createTestClient(server);
    const response = await query({ query: launchQuery });
    expect(response).toMatchSnapshot();
  })
})
