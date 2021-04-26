const {Schema,model}=require("mongoose") // we might also have done like const mongoose =require("mongoose") and refer like mongoose.Schema and mongoose.model

// create schema - actually this is the schema of our mongo collection
const DocumentSchema=new Schema({
	_id:String,
	data:Object // Object means any type of data
})

// now export the model - that can be thought as a reference to our collection
module.exports=model("Document",DocumentSchema) // actually the first argument can be thought as the name of our collection but collection name is lowercased no matter in what case we specify here