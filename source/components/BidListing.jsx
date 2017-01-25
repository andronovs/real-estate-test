import React from 'react';
import moment from 'moment';  

import Listing from '../models/Listing'; 
import RealEstateActionCreators from '../actions/RealEstateActionCreators'; 
import RealEstateStore from '../stores/RealEstateStore'; 

class BidListing extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            listingId: -1, 
            listing: null, 
            lastOffer: null 
        };

        this.onRealEstateDataChange = this.onRealEstateDataChange.bind(this);
        this.submitBid = this.submitBid.bind(this); 
    }    

    componentDidMount() { 
        
        RealEstateStore.addChangeListener(this.onRealEstateDataChange); 

        const listingId = this.props.params.listingId; 
        this.setState({ listingId: listingId });

		RealEstateActionCreators.resetLastOffer(); 
        RealEstateActionCreators.fetchListing(listingId); 
    } 
    
    componentWillUnmount() {

        RealEstateStore.removeChangeListener(this.onRealEstateDataChange);
    }
    
    // callback for the store change event 
    onRealEstateDataChange() {

        const listing = RealEstateStore.getListing(); 
        const lastOffer = RealEstateStore.getLastOffer(); 
        console.log("BidListing: onRealEstateDataChange()", listing, lastOffer); 
        
        this.setState({ listing: listing, lastOffer: lastOffer }); 
    } 
    
    submitBid() {

    	const listingId = this.state.listingId; 
        const offerAmount = this.refs.txtBid.value; 

        console.log("BidListing: submitBid():", listingId, offerAmount); 

        RealEstateActionCreators.validateOffer(listingId, offerAmount); 
    } 

    render() {

        const listingId = this.state.listingId; 
        const listing = this.state.listing; 
        const lastOffer = this.state.lastOffer; 
        console.log("BidListing: render():", listing, listingId, lastOffer); 
            
        if (!listing) {
            return(
                <div>
                    <h4>Listing with Id={this.state.listingId} not found.</h4> 
                </div>
            ); 
        }

        const dateListed = moment(listing.dateListed, "DD-MM-YYYY HH:mm:ss").format("YYYY-MM-DD"); 
		const bidAmount = lastOffer? lastOffer.bidAmount : 0; 
		const lastOfferStatus = lastOffer? lastOffer.status : ""; 

		let bidClass = ""; 
		if (lastOffer) { 
			bidClass = lastOffer.isAccepted? "text-success" : "text-danger"; 
		}

        return (
            <div className="container">

                <div class="row">
                    <div class="col-md-12">
                        <h4>Bidding for listing #{listing.id}</h4> 
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-2 text-right">Address</div>
                    <div class="col-md-6 text-left">{listing.address}</div>
                </div>

                <div class="row">
                    <div class="col-md-2 text-right">Asking Price, $</div>
                    <div class="col-md-6 text-left">{listing.askingPrice}</div>
                </div>

                <div class="row">
                    <div class="col-md-2 text-right">Number of Bedrooms</div>
                    <div class="col-md-6 text-left">{listing.numberOfBedrooms}</div>
                </div>

                <div class="row">
                    <div class="col-md-2 text-right">Date Listed</div>
                    <div class="col-md-6 text-left">{listing.dateListed}</div>
                </div>

                <br />

                <div class="row">
                    <div class="col-md-2 text-right"><b>Max Current Offer, $</b></div>
                    <div class="col-md-6 text-left"><b>{listing.maxBid}</b></div>
                </div>
                <br />

                <div class="row">
                    <div class="col-md-2 text-right">
                        <label for="newMaxBid">Your Offer, $</label>
                    </div>
                    <div class="col-md-6 text-left"> 
                        <input 
                            type="number" 
                            name="dateListed"
                            ref="txtBid"
                            class="numberInputStyle"
                            defaultValue={bidAmount} /> 
                    </div>
                </div>
                <br />

                <div class="row">
                    <div class="col-md-offset-2 col-md-1 text-left"> 
                        <input 
                            type="button" 
                            name="btnSave"
                            value="Submit Bid"
                            class="btn btn-primary"
                            onClick={this.submitBid} /> 
                    </div>
                </div>
                <br />

				{lastOffer ? (
	                <div class="row" class={bidClass}>
	                    <div class="col-md-2 text-right"><b>Offer Status</b></div>
	                    <div class="col-md-6 text-left"><b>{lastOfferStatus}</b></div>
	                </div>
                ) : null }

            </div>
        );

    }

}

export default BidListing;
