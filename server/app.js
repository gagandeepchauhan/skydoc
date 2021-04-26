const express=require("express")
const cors=require("cors")
const app=express()
const server=require('http').Server(app)
const mongoose=require("mongoose")
const Document=require("./Document")

// configuring app
app.use(express.json())
app.use(cors({
	origin:"http://localhost:3000"
}))

// connecting database
mongoose.connect("mongodb://localhost:27017/skydoc",{
	useNewUrlParser:true,
	useUnifiedTopology:true,
	useFindAndModify:false,
	useCreateIndex:true
}).then(()=>console.log("DB CONNECTED")).catch((err)=>console.log(err.message))

// configuring socket- note here we also have to provide the cors details since our front end is in other domain hat's why
const io=require("socket.io")(server,{
	cors:{
		origin:"http://localhost:3000",
		methods:['GET','POST']
	}
})
const DEFAULT_DOC_VALUE=""

io.on("connection",(socket)=>{
	console.log("connected")
	socket.on("get-document",async documentId=>{
		const document=await getDocumentOrCreate(documentId)
		socket.join(documentId) // joining this socket to room identified by this documentId
		socket.emit("load-document",document.data) // here we used socket.emit since we want to send this event to current user also
		// remember in above socket.emit we pass document.data not dodument since it also includes _id field
		socket.on("send-changes",(delta)=>{ // see we can also nest socket.on events
			// console.log(delta)
			socket.broadcast.to(documentId).emit("receive-changes",delta)
		})
		socket.on("save-changes",async data=>{
			await Document.findByIdAndUpdate(documentId,{data}) // here _id remain there it only changes data field
		})
	})
})

async function getDocumentOrCreate(id){
	if(id==null) return
	const document=await Document.findById(id)
	if(document) return document
	return await Document.create({_id:id,data:DEFAULT_DOC_VALUE})
}

// routes
app.post("/create-new-room",async (req,res)=>{
	const id=req.body._id
	Document.create({_id:id,data:DEFAULT_DOC_VALUE},(err,result)=>{
		if(err){
			res.json({
				err:true,
				desc:err.message
			})
		}else{
			res.json({
				err:false,
				desc:"room created successfully",
				room:id
			})
		}
	})
})
app.get("/rooms",(req,res)=>{
	Document.find({},{_id:1},(err,data)=>{
		if(err){
			res.json({
				success:false
			})
		}else{
			res.json({
				success:true,
				data:data
			})
		}
	})
})

// listening 
server.listen(3001,()=>console.log("SERVER STARTED"))