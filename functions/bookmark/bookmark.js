const { ApolloServer, gql } = require('apollo-server-lambda')
var faunadb = require('faunadb'),
  q = faunadb.query;

const typeDefs = gql`
  type Query {
    bookmarks: [Bookmark]
  }
  type Bookmark {
    id: ID!
    title: String!
    url: String!
  }
  type Mutation {
    addBookmark(title: String!, url: String!): Bookmark
    deleteTask(id: ID!): Bookmark
  }
`

const resolvers = {
  Query: {
    bookmarks: async (root, args, context) => {
      try {
        var adminClient = new faunadb.Client({ secret: 'fnAD8ERFPIACBNF2d5qaP7_E3Iv9AsIzNbderRpI' });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('url'))),
            q.Lambda(x => q.Get(x))
          )
        )
        console.log(result.data)

        return result.data.map(d => {
          return {
            id: d.ref.id,
            title: d.data.title,
            url: d.data.url
          }
        })

      } catch (err) {
        console.log(err);
      }
    }
  },
  Mutation: {
    addBookmark: async (_, { title, url,id }) => {
      console.log(title, url)
      try {
        var adminClient = new faunadb.Client({ secret: 'fnAD8ERFPIACBNF2d5qaP7_E3Iv9AsIzNbderRpI' });

        const result = await adminClient.query(
          q.Create(
            q.Collection('bookmark'),
            {
              data: {
                id,
                title,
                url
              }
            },
          )
        )
        return result.data
      }
      catch (err) {
        console.log(err)
      }
    },
    deleteTask:async(__,{id})=>{
      try{
        const reqId=JSON.stringify(id)
      const reqId2=JSON.parse(id);
      console.log(id);
      var adminClient =new faunadb.Client({secret:"fnAD8ERFPIACBNF2d5qaP7_E3Iv9AsIzNbderRpI"})
      const result = await adminClient.query(
        q.Delete(q.Ref(q.Collection("bookmark"),id))
      );
      return {
        id: result.ref.id,
        title: result.data.title,
        url: result.data.url,
      };
      }catch(error){
        return error.toString();
      }
    }
  }

}


const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()