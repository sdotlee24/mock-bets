import mongoose from 'mongoose'

export const BetSchema = new mongoose.Schema({
    oneOdds: {
        type: Number,
        required: true,
    },
    twoOdds: {
        type: Number,
        required: true,
    },
    teamOne: {
        type: String,
        required: true
    },
    teamTwo: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    unixDate: {
        type: Number,
        required: true
    },
    pickedTeam: {
        type: String,

    },
    status: {
        type: String,
        required: true
    }


   
});

export const BetModel = new mongoose.model('Bet', BetSchema);