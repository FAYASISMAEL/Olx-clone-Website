import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    email:{type: String, required:true},
    category:{type:String, required:true},
    postImage: [{ type: String }],
    brand: {type:String,required:true},
    description: { type: String, required: true},
    name : {type:String,default:null},
    year:{type:String,default:null},
    fuel:{type:String,default:null},
    transmission:{type:String,default:null},
    owners:{type:String,default:null},
    title:{type:String,default:null},
    price:{type:String,required:true},
    location: {
        state: { type: String, required: true },
        district: { type: String, required: true },
        city: { type: String, required: true },
    },
    km_driven:{type:String,required:true},

    like: [{type:String}],
})

export default mongoose.model.post || mongoose.model('Posts',postSchema);