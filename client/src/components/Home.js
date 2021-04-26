import React,{useState} from 'react'
import {useHistory} from 'react-router-dom'
import HomeSvg from '../undraw.svg'

export default function Home({createNewRoom,roomId,setRoomId}) {
	const [id,setId]=useState('')
	const [joining,setJoining]=useState(false)
	const [creating,setCreating]=useState(false)
	const [error,setError]=useState({err:false,desc:''})
	const history=useHistory()
	function handleSubmit(e){
		e.preventDefault()
		setJoining(true)
		setTimeout(()=>{
			history.push(`/editor/${id}`)
		},1000)
	}
	async function createRoom(){
		setCreating(true)
		const {room,desc,err}=await createNewRoom()
		setError({err,desc})
		setTimeout(()=>{
			setRoomId(room)
		},1000)
	}
	return (
		<div className="home">
			<div className="jumbotron">
				<h1 style={{color:"#6C63FF",fontWeight:"bolder"}}>Welcome to Skydocs</h1>
				<hr/>
				<p>here you can create new room or can join existing room and start your collaboration </p>
			</div>
			<div className="home row my-5 p-4">
				<div className="navs my-3 col col-12 col-md-6">
					<div>
						{roomId ? <div className="alert alert-primary p-2">New room created : <strong><em>{roomId}</em></strong><br/>you can copy this room id and join this room</div> : 
								<>{creating ? <><div className="spinner-grow text-primary mx-2" style={{background:"#6C63FF"}} role="status">
  												<span className="sr-only">creating...</span>
									   		  </div>
									   		  <span className="mx-2" style={{color:"#6C63FF"}}>Creating room...</span>
									   		  </> : 
									   		  <button className="btn btn-lg btn-primary" style={{background:"#6C63FF"}} onClick={createRoom}>create new room</button>
								  }
								</>
						}
						{error.err && <div className="alert alert-danger p-2">{error.desc}</div>}
					</div>
					<form onSubmit={handleSubmit}>
						<label htmlFor="join">Join</label>
						<div className="input-group">
							<input className="form-control" id="join" required type="text" value={id} onChange={(e)=>setId(e.target.value)} placeholder="enter room id"/>
							{joining ? <><div className="spinner-grow text-primary mx-2" style={{background:"#6C63FF"}} role="status">
  										<span className="sr-only">Loading...</span>
									   </div>
									   <span className="mx-2" style={{color:"#6C63FF"}}>Joining room...</span>
									   </> : 
									<div className="input-group-append"><button style={{background:"#6C63FF"}} className="btn btn-primary" type="submit">join</button></div>
								}
						</div>
					</form>
				</div>
				<div className="col my-3 col-12 col-md-6">
					<img className="image" src={HomeSvg} alt="home undraw svg"/>
				</div>
			</div>
		</div>
	)
}