import React,{useState,useEffect,useCallback} from 'react'
import io from 'socket.io-client'
import 'quill/dist/quill.snow.css'
import {useParams} from 'react-router-dom'
import Quill from 'quill'

const SAVE_IN_MS=2000
const TOOLBAR_OPTIONS= [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];

export default function TextEditor() {
	const [socket,setSocket]=useState()
	const [quill,setQuill]=useState()
	const {id:documentId}=useParams()

	// socket connection
	useEffect(()=>{
		const newSocket=io("http://localhost:3001")
		setSocket(newSocket)
		return ()=>{
			newSocket.disconnect()
		}
	},[])

	// saving the changes
	useEffect(()=>{
		if(socket==null || quill==null) return
		const interval=setInterval(()=>{
			socket.emit("save-changes",quill.getContents())
		},SAVE_IN_MS)
		return ()=>{
			clearInterval(interval)
		}
	},[socket,quill])

	// getting the document from server
	useEffect(()=>{ 
		if(socket==null || quill==null) return
		socket.once("load-document",(data)=>{ // using socket.once will ensure the opening and closing the event itself
			quill.setContents(data)
			quill.enable()
		}) 
		socket.emit("get-document",documentId)
	},[socket,quill,documentId])

	// receiving changes
	useEffect(()=>{
		if(socket==null || quill==null) return
		const handler=(delta)=>{
			quill.updateContents(delta)
		}
		socket.on("receive-changes",handler)
		return ()=>{
			socket.off("receive-changes",handler)
		}
	},[socket,quill])

	// send changes
	useEffect(()=>{
		if(socket==null || quill==null) return
		const handler=(delta,oldDelta,source)=>{
			if(source!=='user') return
			socket.emit("send-changes",delta)
		}
		quill.on("text-change",handler)// note event is 'tst-change' not 'text-changes'
		return ()=>{
			quill.off("text-change",handler)
		}
	},[socket,quill])

	// setting up quill
	const wrapperRef=useCallback((wrapper)=>{
		if(wrapper==null) return 
		wrapper.innerHTML=''  
		const editor=document.createElement('div')
		wrapper.append(editor)
		const q=new Quill(editor,{theme:'snow',modules:{
			toolbar:TOOLBAR_OPTIONS
		}})
		q.disable()
		q.setText("Loading...")
		setQuill(q)
	},[])

	return (
		<div className="container-editor" ref={wrapperRef}></div>
	)
}