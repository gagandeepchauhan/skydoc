import React from 'react'
import {Link} from 'react-router-dom'

export default function PageNotFound() {
	return (
		<div>
			<div className="jumbotron" style={{background:"rgb(249, 222, 147)"}}>
			  <h1 className="display-4">Page Not Found (404)</h1>
			  <p className="lead">It seems you are looking for a page that does not exists.</p>
			  <hr className="my-4"/>
			  <p>If you were trying to join a room - than this room does not exist.</p>
			  <p className="lead">
			    <Link className="btn btn-light btn-lg" to="/" role="button">Go home</Link>
			  </p>
			</div>
		</div>
	)
}