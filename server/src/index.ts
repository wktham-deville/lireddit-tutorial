import "reflect-metadata";
import "dotenv-safe/config";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from 'connect-redis';
import cors from "cors";
import express from "express";
import session from 'express-session';
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import {createConnection} from "typeorm";
import { User} from "./entities/User";
import { Post } from "./entities/Post";
import { Updoot } from "./entities/Updoot";
import path from "path";
import {createUserLoader} from "./utils/createUserLoader"
import { createUpdootLoader } from "./utils/createUpdootLoader";
//rerun
const main = async() => {
  const conn = await createConnection({
    type: "postgres",
    // database: "lireddit2",
    // username: "postgres",
    // password: "admin",
    url: process.env.DATABASE_URL,
    logging: true,
    //synchronize: true,
    migrationsRun: true,
    migrations: [path.join(__dirname,"./migrations/*")],
    entities: [Post, User, Updoot],
  });

  //await conn.runMigrations();
  await Post.delete({});
  await User.delete({});
  //sendEmail("bob@bob.com", "hello world");
  //await Post.delete({});
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  app.set("trust proxy",1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
          client: redis,
          disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365*10,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
        domain: __prod__? ".wktham.xyz":undefined
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
  })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ 
      req, 
      res, 
      redis, 
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
     }),
    plugins:  [ ApolloServerPluginLandingPageGraphQLPlayground ]
  });
  
  await apolloServer.start();

  apolloServer.applyMiddleware({ 
    app,
    cors:false
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log("server started on localhost:4000");
  });
}

main().catch((err) => {
  console.error(err);
});
