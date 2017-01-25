import React from 'react'; 
import moment from 'moment';  

import Listing from '../models/Listing'; 
import RealEstateActionCreators from '../actions/RealEstateActionCreators'; 
import RealEstateStore from '../stores/RealEstateStore'; 

const inputStyle = {
    width: '100%' 
};

class EditListing extends React.Component { 
    
    constructor(props) {
        super(props);

        this.state = {
            listingId: -1, 
            listing: null 
        };

        this.onRealEstateDataChange = this.onRealEstateDataChange.bind(this);
        this.saveListing = this.saveListing.bind(this); 
    }    
    
    componentDidMount() { 
        
        RealEstateStore.addChangeListener(this.onRealEstateDataChange); 

        const listingId = this.props.params.listingId; 
        this.setState({ listingId: listingId });

        RealEstateActionCreators.fetchListing(listingId); 
    } 
    
    componentWillUnmount() {

        RealEstateStore.removeChangeListener(this.onRealEstateDataChange);
    }
    
    // callback for the store change event 
    onRealEstateDataChange() {

        const listing = RealEstateStore.getListing() || new Listing(); 
        console.log("EditListing: onRealEstateDataChange()", listing); 
        
        this.setState({ listing: listing }); 
    } 
    
    saveListing() {

        let listing = this.state.listing; 
        listing.address = this.refs.txtAddress.value; 
        listing.askingPrice = this.refs.txtAskingPrice.value; 
        listing.numberOfBedrooms = this.refs.txtNumberOfBedrooms.value; 
        listing.dateListed = this.refs.txtDateListed.value; 

        this.setState({ listing: listing }); 

        console.log("EditListing: saveListing():", this.state.listing); 

        const listingId = this.state.listingId; 
        if (listingId > 0) {
            RealEstateActionCreators.updateListing(listing); 
        }
        else {
            RealEstateActionCreators.addNewListing(listing); 
        }

        alert(`New listing has been added successfully!`); 

        // redirect back to the main listing view 
        window.location.href = '/#'; 
    } 
    
    render() { 

        const listingId = this.state.listingId; 
        const listing = this.state.listing; 
        console.log("EditListing: render():", listing, listingId); 
            
        if (!listing) {
            return(
                <div>
                    <h4>Listing with Id={this.state.listingId} not found.</h4> 
                </div>
            ); 
        }

        const dateListed = moment(listing.dateListed, "DD-MM-YYYY HH:mm:ss").format("YYYY-MM-DD"); 
        const pageHeader = listingId > 0? `Editing listing #${listing.id}` : "Adding a New Listing"; 
        //const x = moment(new Date()).format("YYYY-MM-DD"); 

        return(
            <div className="container">

                <div class="row">
                    <div class="col-md-12">
                        <h4>{pageHeader}</h4> 
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-2 text-right">
                        <label for="address">Address</label>
                    </div>
                    <div class="col-md-6">
                        <input type="text" 
                                name="address" 
                                ref="txtAddress" 
                                style={inputStyle}
                                defaultValue={listing.address} />
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-2 text-right">
                        <label for="askingPrice">Asking Price, $</label>
                    </div>
                    <div class="col-md-6 text-left"> 
                        <input 
                            type="number" 
                            name="askingPrice"
                            ref="txtAskingPrice"
                            class="numberInputStyle"
                            defaultValue={listing.askingPrice} /> 
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-2 text-right">
                        <label for="numberOfBedrooms">Number of Bedrooms</label>
                    </div>
                    <div class="col-md-6 text-left"> 
                        <input 
                            type="number" 
                            name="numberOfBedrooms"
                            ref="txtNumberOfBedrooms"
                            class="numberInputStyle"
                            defaultValue={listing.numberOfBedrooms} /> 
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-2 text-right">
                        <label for="dateListed">Date Listed</label>
                    </div>
                    <div class="col-md-6 text-left"> 
                        <input 
                            type="date" 
                            name="dateListed"
                            ref="txtDateListed"
                            class="numberInputStyle"
                            defaultValue={dateListed} /> 
                    </div>
                </div>
                <br />

                <div class="row">
                    <div class="col-md-offset-2 col-md-1 text-left"> 
                        <input 
                            type="button" 
                            name="btnSave"
                            value="Save Listing"
                            class="btn btn-primary"
                            onClick={this.saveListing} /> 
                    </div>
                </div>

            </div>
        ) 
    }
}

export default EditListing;
