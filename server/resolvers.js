const resolvers = {
    Query:{
       usersDetails:async (_,__,{dataSources,users,res})=>{return dataSources.usersApi.getSignedUserDetails(users,res);}
    },
    Mutation:{
       signUp:async(_,args,{ dataSources})=>{return dataSources.usersApi.addUsers(args);},
       signIn:async(_,args,{dataSources,res})=>{return dataSources.sessionsApi.signInUser(args,res);},
       signOut:async(_,__,{dataSources,res})=>{return dataSources.sessionsApi.logOut(res);}
    }
}

module.exports = resolvers; 
