const graphql = require('graphql')

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = graphql

const Movies = require('../models/movie')
const Directors = require('../models/director')

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        rate: { type: GraphQLInt },
        director: {
            type: DirectorType,
            resolve({directorId}, args) {
                return Directors.findById(directorId)
            }
        }
    })
})

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        movies: {
            type: new GraphQLList(MovieType),
            resolve({id}, args) {
                return Movies.find({directorId: id})
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, {name, age}) {
                const director = new Directors({
                    name: name,
                    age: age
                });
                director.save()
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                watched: { type: new GraphQLNonNull(GraphQLBoolean) },
                rate: { type: GraphQLInt },
                directorId: { type: GraphQLID }
            },
            resolve(parent, {name, genre, directorId, watched, rate}) {
                const movie = new Movies({
                    name: name,
                    genre: genre,
                    directorId: directorId,
                    watched: watched,
                    rate: rate,
                });
                movie.save()
            }
        },
        deleteDirector: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, {id}) {
                return Directors.findByIdAndRemove(id)
            }
        },
        deleteMovie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, {id}) {
                return Movies.findByIdAndRemove(id)
            }
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLID },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                watched: { type: new GraphQLNonNull(GraphQLBoolean) },
                rate: { type: GraphQLInt },
            },
            resolve(parent, {id, name, directorId, genre, watched, rate }) {
                return Movies.findByIdAndUpdate(id, {
                    $set: {
                        name: name,
                        directorId: directorId,
                        genre: genre,
                        watched: watched,
                        rate: rate,
                    }
                },
                    { new: true })
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, {id, name, age}) {
                return Directors.findByIdAndUpdate(id, {
                    $set: {
                        name: name,
                        age: age
                    }
                },
                    { new: true })
            }
        },
    }
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLString } },
            resolve(parent, {id}) {
                return Movies.findById(id)
            }
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLString } },
            resolve(parent, {id}) {
                return Directors.findById(id)
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            args: { name: { type: GraphQLString } },
            resolve(parent, {name}) {
                return Movies.find({ name: { $regex: name, $options: "i" } })
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            args: { name: { type: GraphQLString } },
            resolve(parent, {name}) {
                return Directors.find({ name: { $regex: name, $options: "i" } })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})