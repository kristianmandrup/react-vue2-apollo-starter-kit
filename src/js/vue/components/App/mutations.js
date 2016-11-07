import gql from 'graphql-tag';
import graphql from 'graphql'

// See https://www.npmjs.com/package/graphql
// graphql(schema, query).then(result => { ... })
// createUserQuery is the schema
// TODO: instead use the vue-apollo query mechanism
//    https://github.com/Akryum/vue-apollo#simple-query

// apollo: {
//   // Simple query that will update the 'hello' vue property
//   hello: gql`{hello}`,
// },


// using reactive parameters
//    https://github.com/Akryum/vue-apollo#query-with-parameters
//    https://github.com/Akryum/vue-apollo#reactive-parameters

// Also see Advanced options
//    https://github.com/Akryum/vue-apollo#advanced-options

// And mutations
//    https://github.com/Akryum/vue-apollo#mutations

// apollo: {
//   // Query with parameters
//   ping: {
//     query: gql`query PingMessage($message: String!) {
//       ping(message: $message)
//     }`,
//     // Reactive parameters
//     variables() {
//       // Use vue reactive properties here
//       return {
//           message: this.pingInput,
//       };
//     },
//   },
// },

import { default as queries } from './queries'

// See https://github.com/Akryum/vue-apollo#mutations
export const createUser = (ctx) => {
  return {
    query: gql(queries.createUserQuery),
    variables: {
      user: {
        username: ctx.username,
        password: ctx.password
      }
    },
    updateQueries: {
      createUser: (previousQueryResult, { mutationResult }) => {
        return mutationResult
      }
    },
    // Optimistic UI
    // Will be treated as a 'fake' result as soon as the request is made
    // so that the UI can react quickly and the user be happy
    // optimisticResponse: {
    //   __typename: 'Mutation',
    //   addTag: {
    //     __typename: 'Tag',
    //     id: -1,
    //     label: newTag,
    //   },
    // },  
  }
}    

export const LoginWithData = graphql(queries.LoginUserMutation, {
})


export const RegisterWithData = graphql(queries.CreateUserMutation, {

})

