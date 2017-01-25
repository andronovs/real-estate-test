import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, Link, hashHistory, useRouterHistory, IndexRoute } from 'react-router';
 
import Application from '../source/components/Application';
import Listings from '../source/components/Listings';
import EditListing from '../source/components/EditListing'; 
import BidListing from '../source/components/BidListing';

const rootElement = document.getElementById('react-application'); 

const NotFound = React.createClass({
  render() {
    return <h2>Not found</h2>
  }
})

ReactDOM.render(
	  <Router history={hashHistory}>
	    <Route path="/" component={Application}>
		    <IndexRoute component={Listings} />
		    <Route path="/editListing/:listingId" component={EditListing} />
		    <Route path="/addListing/:listingId" component={EditListing} />
		    <Route path="/bidListing/:listingId" component={BidListing} />
	    </Route>
	    <Route path="*" component={NotFound} />
	  </Router>,	

	rootElement
);
