const mongoose = require('mongoose')
const id_validator = require ('mongoose-id-validator');

const PathSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true }
);


var TourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    start_date: {
        type: Date,
        required: true,
        trim: true
    },
    duration: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Doration must be a postive number')
            }
        }
    },
    price: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Price must be a postive number')
            }
        }
    },
    guide: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guide',
        required:true
    },
    path: {
        type: Map, of:String,
        default: {}
    }

}, { timestamps: true }
);

const Tour = mongoose.model('Tour', TourSchema);
TourSchema.plugin(id_validator);

module.exports = Tour
