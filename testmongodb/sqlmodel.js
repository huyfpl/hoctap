const mongoose = require('mongoose');
const ip = new mongoose.Schema({
    Addressip: {
        type: String,
        require: true
    }
},{
   collection:"checkip"
}
)
const ipModel=mongoose.model('checkip',ip)
module.exports={ipModel};
