var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLDate = require('graphql-date');
var UserModel = require('../models/Users');

var userType = new GraphQLObjectType({
	name: 'user',
	fields: function () {
		return {
			_id: {
				type: GraphQLString
			},
			firstname: {
				type: GraphQLString
			},
			lastname: {
				type: GraphQLString
			},
			type: {
				type: GraphQLString
			},
			email: {
				type: GraphQLString
			},
			phone: {
				type: GraphQLString
			},
			created_at: {
				type: GraphQLDate
			},
			updated_at: {
				type: GraphQLDate
			}
		}
	}
});


var queryType = new GraphQLObjectType({
	name: 'Query',
	fields: function () {
		return {
			users: {
				type: new GraphQLList(userType),
				resolve: function () {
					const users = UserModel.find().exec()
					if (!users) {
						throw new Error('Error')
					}
					return users
				}
			},
			user: {
				type: userType,
				args: {
					id: {
						name: '_id',
						type: GraphQLString
					}
				},
				resolve: function (root, params) {
					const userDetails = UserModel.findById(params.id).exec()
					if (!userDetails) {
						throw new Error('Error')
					}
					return userDetails
				}
			}
		}
	}
});

var mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: function () {
		return {
			addUser: {
				type: userType,
				args: {
					firstname: {
						type: new GraphQLNonNull(GraphQLString)
					},
					lastname: {
						type: new GraphQLNonNull(GraphQLString)
					},
					type: {
						type: new GraphQLNonNull(GraphQLString)
					},
					email: {
						type: new GraphQLNonNull(GraphQLString)
					},
					phone: {
						type: new GraphQLNonNull(GraphQLString)
					}
				},
				resolve: function (root, params) {
					const userModel = new UserModel(params);
					const newUser = userModel.save();
					if (!newUser) {
						throw new Error('Error');
					}
					return newUser
				}
			},

			updateUser: {
				type: userType,
				args: {
					id: {
						name: 'id',
						type: new GraphQLNonNull(GraphQLString)
					},
					firstname: {
						type: new GraphQLNonNull(GraphQLString)
					},
					lastname: {
						type: new GraphQLNonNull(GraphQLString)
					},
					type: {
						type: new GraphQLNonNull(GraphQLString)
					},
					email: {
						type: new GraphQLNonNull(GraphQLString)
					},
					phone: {
						type: new GraphQLNonNull(GraphQLString)
					}
				},
				resolve(root, params) {
					return UserModel.findByIdAndUpdate(params.id, { firstname: params.firstname, lastname: params.lastname, type: params.type, email: params.email, phone: params.phone, updated_at: new Date() }, function (err) {
						if (err) return next(err);
					});
				}
			},
			removeUser: {
				type: userType,
				args: {
					id: {
						type: new GraphQLNonNull(GraphQLString)
					}
				},
				resolve(root, params) {
					const remUser = UserModel.findByIdAndRemove(params.id).exec();
					if (!remUser) {
						throw new Error('Error')
					}
					return remUser;
				}
			}

		}

	}
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
