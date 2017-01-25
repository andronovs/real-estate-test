import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events'; 
import _ from 'lodash'; 
import assign from 'object-assign'; 
import moment from 'moment'; 

import ajax from 'superagent';
require('superagent-auth-bearer')(ajax);

let _listings = []; 
let _listing = null; 
let _lastOffer = null; 

function emitChange() {
    RealEstateStore.emit('change'); 
}

var RealEstateStore = assign({}, EventEmitter.prototype, {
    
    addChangeListener: function(callback) {
        this.on('change', callback); 
    }, 
    
    removeChangeListener: function(callback) {
        this.removeListener('change', callback); 
    },
    
    getListings: function() {
        return _listings; 
    }, 

    getListing: function() {
        return _listing; 
    }, 

    getLastOffer: function() {
        return _lastOffer; 
    }     
}); 

function handleAction(action) {
 
    if (action.type === 'fetch_listings') { 
        _initListings(); 
    } 

    if (action.type === 'fetch_listing') { 
        _initListing(action.id); 
    }

    if (action.type == 'update_listing') {
        _updateListing(action.listing); 
    }

    if (action.type == 'add_new_listing') {
        _addNewListing(action.listing); 
    }

    if (action.type == 'delete_listing') {
        _deleteListing(action.id); 
    } 

    if (action.type == 'reset_last_offer') {
        _lastOffer = null; 
    }  

    if (action.type == 'validate_offer') {
        _validateOffer(action.id, action.amount); 
    }    
}

//////////////////////////////
function _initListings() {

    ajax.get('/api/listings')
    .end((err, res) => {
        if (err || !res.ok) {
            console.warn('RealEstateStore: There was an error fetching the real estate listings.'); 
        } else {
            _listings = JSON.parse(res.body); 
            emitChange(); 
        }         
    });         
} 

function _initListing(listingId) {

    ajax.get(`/api/listing/${listingId}`)
    .end((err, res) => {
        if (err || !res.ok) {
            console.warn(`RealEstateStore: There was an error fetching the real estate listing by Id=${listingId}.`); 
        } else {
            _listing = JSON.parse(res.body); 
            console.log("_initListing():", listingId, _listing); 
            emitChange(); 
        }         
    });         
} 

function _updateListing(listing) { 
    console.log("_updateListing():", listing); 

    var ajax = require('superagent');
    ajax.put(`/api/listing/${listing.id}`)
    .send({ listing: JSON.stringify(listing) }) 
    .end(function(err, resp) {
        if (err || !resp.ok) {
            console.warn('There was an error updating the real estate listing:', listing); 
        } else {
            emitChange();
        } 
    }); 
}

function _addNewListing(listing) { 
    console.log("_addNewListing():", listing); 

    var ajax = require('superagent');
    ajax.post('/api/listing')
    .send({ listing: JSON.stringify(listing) }) 
    .end(function(err, resp) {
        if (err || !resp.ok) {
            console.warn('There was an error adding the real estate listing:', listing); 
        } else {
            emitChange();
        } 
    }); 
}

function _deleteListing(id) { 
    console.log("_deleteListing():", id); 

    var ajax = require('superagent');
    ajax.delete(`/api/listing/${id}`)
    .end(function(err, resp) {
        if (err || !resp.ok) {
            console.warn('There was an error deleting the real estate listing with Id=', id); 
        } else {
            emitChange();
        } 
    }); 
}

function _validateOffer(id, amount) {
    console.log("_validateOffer():", id, amount); 

    var ajax = require('superagent');
    ajax.post('/api/offer')
    .send({ listingId: id }) 
    .send({ amount: amount }) 
    .end(function(err, resp) {
        if (err || !resp.ok) {
            console.warn('There was an error validating the offer:', id, amount); 
        } else {
            _lastOffer = JSON.parse(resp.body); 
            console.log("_validateOffer():", _lastOffer); 
            emitChange();
        } 
    }); 
} 

//////////////////////////////

RealEstateStore.dispatchToken = AppDispatcher.register(handleAction);

export default RealEstateStore; 
