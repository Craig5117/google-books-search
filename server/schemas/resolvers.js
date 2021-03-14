const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // checks to make sure I am who I am supposed to be
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('thoughts')
                    .populate('friends')
                
                    return userData;
            }

            throw new AuthenticationError('Not logged in')
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            console.log(user);
            const token = signToken(user);
            return  { token, user };
            // return user;
        },
        login: async (parent, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError ('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user }
        },
        saveBook: async (parent, { input }, context) => {
            if (context.user) {
                console.log(input)
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError ('You need to be log in first.');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId : bookId}} },
                    { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError ('You need to be log in first.');
        }
    }
}

module.exports = resolvers;