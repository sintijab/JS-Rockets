const { GraphQLScalarType } = require('graphql');

const resolvers = {
  Query: {
    launches: (_, __, { dataSources }) =>
     dataSources.launchAPI.getAllLaunches(),
    launchBy: (_, { param, customer, year }, { dataSources }) =>
      dataSources.launchAPI.getLaunchBy({ query: param, customer: customer, year })
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),
}

module.exports = resolvers;
