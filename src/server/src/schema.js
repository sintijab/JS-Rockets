const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Date

  type Customers {
    customer_name: String
  }

  type Payloads {
    payload_id: ID!
    customers: [Customers]
  }

  type SecondStage {
    payloads: [Payloads]
  }

  type Rocket {
    stage: SecondStage
  }

  type Launch {
    flight_number: Int
    mission_name: String
    rocket: Rocket
    date: Date
    payloads_amount: Int
    customer: String
    year: Int
  }

  type Query {
    launches: [Launch]
    launchBy(param: String, customer: String, year: Int): [Launch]
  }
`;
module.exports = typeDefs;
