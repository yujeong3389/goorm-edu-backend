const { ApolloServer, gql } = require('apollo-server');
const lodashId = require('lodash-id');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db._.mixin(lodashId);
const collection=db.get('products');

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Product {
    id:ID!
    name:String!
    price:Int!
    imgUrl:String!
  }


  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    products: [Product!]!
  }

  type Mutation{
    addProduct(name:String,price:Int,imgUrl:String):Product
  }
`;

const resolvers = {
    Query: {
      products: () =>{
        return db.get("products")
      }
    },
    Mutation:{
        addProduct:(_,{name,price,imgUrl})=>{
            const newItem=collection.insert({name,price,imgUrl}).write();
            return newItem
        }
    }
  };

  const {
    ApolloServerPluginLandingPageLocalDefault
  } = require('apollo-server-core');

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
  
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });