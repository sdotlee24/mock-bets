import mongoose from 'mongoose'
import { BetSchema } from './Bets.js';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    points: {
        type: Number
    },
    betLog: [BetSchema]
});

export const UserModel = new mongoose.model('User', UserSchema);


