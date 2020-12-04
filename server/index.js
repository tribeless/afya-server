const express = require('express');
const {
    ApolloServer,
} = require('apollo-server-express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const expressJwt = require('express-jwt');
const app = express();
const Users = require('./dataSources/model/User');
const {
    UsersApi,
    SessionsApi
} = require('./routes');


require('dotenv').config();
const configValues = process.env;

const PORT = configValues.PORT || 4300;

async function connectToDatasource() {
    try {
        await mongoose.connect(configValues.DB_CONNECTION_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected successfully to our datasource');
    } catch (e) {
        throw new Error('Could not connect, please contact us if problem persists');
    }
}

connectToDatasource();
app.use(cookieParser());
app.use(expressJwt({
    secret: configValues.SECRET,
    algorithms: ["HS256"],
    getToken: req => req.cookies.jwt,
    credentialsRequired: false
}))

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({
        req,
        connection,
        res
    }) => {
        if (connection) {
            return connection.context;
        } else {
            let user = req.user || "";
            
            let users;
            if (user) users = await Users.findOne({
                _id: req.user.id
            })
            
            return {
                users,
                res
            }
        }

    },
    dataSources: () => ({
        
        usersApi: new UsersApi(),
        sessionsApi: new SessionsApi()
    }),
    formatError: (err) => ({
        message: err.message
    })
});

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


app.use(cors({
    origin: configValues.ORIGIN,
    credentials: true
}));


server.applyMiddleware({
    app,
    cors: false
})


app.listen(PORT, () => console.log(`🚀 Server ready at http://localhost:${configValues.PORT}${server.graphqlPath}`));
