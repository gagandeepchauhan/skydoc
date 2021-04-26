import {useEffect,useState} from 'react'
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import {v4 as uuidV4} from 'uuid'
import TextEditor from './components/TextEditor'
import Home from './components/Home'
import PageNotFound from './components/PageNotFound'

export default function App() {
  const [rooms,setRooms]=useState([])
  const [roomId,setRoomId]=useState('')
  useEffect(()=>{
    fetch("http://localhost:3001/rooms",{
      method:'GET',
      headers:{
        "Content-Type":"application/json",
      }
    })
    .then((response)=>response.json())
    .then(json=>{
      if(json.success){
        setRooms(json.data)
      }
    })
  },[roomId])
  function docExist(id){
    return rooms.find(room=>room._id===id)
  }
  function createNewRoom(){
    return fetch("http://localhost:3001/create-new-room",{
      method:'POST',
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        _id:uuidV4()
      })
    })
    .then((response)=>response.json())
    .then(json=>{
      return json
    })
  }
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Home createNewRoom={createNewRoom} roomId={roomId} setRoomId={setRoomId}/>
        </Route>
        <Route path="/editor/:id"                                                                                 
               render={props=>{
                  if(docExist(props.match.params.id)){
                    return <TextEditor/>
                  }else{
                    return <PageNotFound/>
                  }
               }}
        />                                                                               
        <Route path="*" component={PageNotFound}/>
      </Switch>
    </Router>
  )
}