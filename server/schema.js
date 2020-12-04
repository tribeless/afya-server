const {gql} = require("apollo-server-express");

const typeDefs = gql `

type Query {
    usersDetails: [UserDetails]
}

type Mutation {
    signIn(email: String!, password: String!): Result
    signUp(input: UserData!): Result
    signOut: Results
}
input UserData{
    firstName:String!
    lastName:String!
    email:String!
    password:String!
}
type Result {
    status: Boolean
    id: String
}
type UserDetails {
    email: String
    firstName: String
    lastName: String
}
type Results {
    status: Boolean!
    message: String!
}
`

module.exports = typeDefs;