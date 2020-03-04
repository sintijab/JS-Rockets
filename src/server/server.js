const { ApolloServer, gql } = require('apollo-server');
const LaunchAPI = require('./src/datasources/launch');
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');

const dataSources = () => ({
  launchAPI: new LaunchAPI(),
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  playground: true,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
