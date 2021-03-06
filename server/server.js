const express = require("express");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const schema = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const mongoose = require("mongoose");
require("dotenv").config();

async function startServer() {
  const userName = process.env.USER_NAME;
  const password = process.env.PASSWORD;
  const URI = `mongodb+srv://${userName}:${password}@cluster0.89g21.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const app = express();

  const publicPath = path.resolve(__dirname, "../dist");

  app.use("/", express.static(publicPath));

  const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        // options
      }),
    ],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app, path: "/graphql" });
  app.use((req, res) => {
    res.send("Hello from express apollo server");
  });
  await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Mongoose connected");
  app.listen(process.env.PORT || 4005, () => {
    console.log("Server is running on port 4005");
  });
}
startServer();
