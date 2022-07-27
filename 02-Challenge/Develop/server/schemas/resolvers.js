const {User, Book} = require('../models');
const {AuthenticationError} = require('apolo-server-express');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne ({})
                .select('-__v -password');
                return userData;
            }
            throw new AuthenticationError('Login to proceed');
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return{token, user};
        },
        login: async(parent, {email, password}) => {
            const user = await User.findOne({email});
            if(!user) {
                throw new AuthenticationError('Error');
            }
            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw){
                throw new AutenticationError('Error');
            }
            const token = signToken(user);
            return{token, user};
        },
        saveBook: async (parent, {book}, context) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate (
                    {_id: context.user._id},
                    {$addToSet: {savedBooks: {bookId: bookId}}},
                )
                return updatedUser;
            }
            throw new AuthenticationError('Login to proceed');
        },
        removeBook: async (parent, {bookId}, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookId: bookId}}},
                    {new: true}
                )
                return updatedUser;
            }
        }
    }
};

module.exports = resolvers;