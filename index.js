const { ApolloServer, gql } = require("apollo-server");

const books = [
  {
    id: 1,
    title: "The Awakening",
    author: {
      id: 3,
      firstname: "Kate",
      secondname: "Chopin",
    },
  },
  {
    id: 4,
    title: "Top like topper behave like backbencher ",
    author: {
      id: 5,
      firstname: "Anubhav",
      secondname: "Gupta",
    },
  },
];

const typeDefs = gql`
  interface Node {
    id: ID!
  }
  type Book implements Node {
    id: ID!
    title: String!
    author: Auth!
  }

  type Auth implements Node {
    id: ID!
    firstname: String!
    secondname: String!
  }

  type Query {
    books: [Book]!
    authors: [Book!]!
  }

  input bookInput {
    id: ID!
    title: String!
    author: authInput!
  }
  input authInput {
    id: ID!
    firstname: String!
    secondname: String!
  }
  type Mutation {
    addBook(book: bookInput!): Book
    updateBook(bookId: ID!, book: bookInput!): Book
    # updateBook(bookId: String!, title: String!): Book
  }
`;

const resolvers = {
  Query: {
    books: () => {
      return books;
    },
    authors: () => books,
  },
  Mutation: {
    addBook(parent, args, context, info) {
      books.push(args.book);
      let re = books[books.length - 1];
      console.log(re);
      return re;
    },
    updateBook: (parent, args, context, info) => {
      console.log(args);

      let index = -1;
      for (let i = 0; i < books.length; i++) {
        if (books[i].id == args.bookId) {
          index = i;
          break;
        }
      }
      books[index] = args.book;
      console.log(args.book);
      return args.book;
      // const obj = {
      //   id: args.bookId,
      //   title: args.title,
      // };

      // books[0] = obj;
      // console.log(obj);
      // return books[0];
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
