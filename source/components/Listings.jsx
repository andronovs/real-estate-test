import React from 'react';
//import moment from 'moment'; 

import RealEstateActionCreators from '../actions/RealEstateActionCreators'; 
import RealEstateStore from '../stores/RealEstateStore'; 

const listingItemStyle = {
    textAlign: 'left' 
};

class Listings extends React.Component {

    constructor(props) {
        super(props); 

        this.state = {
            listings: [] 
        }; 

        this.onRealEstateDataChange = this.onRealEstateDataChange.bind(this);
        this.renderListingRow = this.renderListingRow.bind(this); 
        this.deleteListing = this.deleteListing.bind(this); 
    } 

    componentDidMount() { 
        RealEstateStore.addChangeListener(this.onRealEstateDataChange); 

        RealEstateActionCreators.fetchListings(); 
    } 

    componentWillUnmount() {
        RealEstateStore.removeChangeListener(this.onRealEstateDataChange);
    } 

    // callback for the store change event 
    onRealEstateDataChange() {

        const listings = RealEstateStore.getListings();  
        
        this.setState({ listings: listings }); 
    } 

    deleteListing(listing) {
        //e.preventDefault();
        console.log("deleteListing()"); 

        if (confirm(`Delete the listing with Id=${listing.id}?`)) { 
            RealEstateActionCreators.deleteListing(listing.id); 

            alert(`Listing with Id=${listing.id} has been deleted successfully!`); 
            
            // refresh the main listing view 
            RealEstateActionCreators.fetchListings(); 
        }
    }

    renderListingRow(listing) { 

        const keyId = `key_${listing.id}`; 
        const editLink = `#/editListing/${listing.id}`; 
        const bidLink = `#/bidListing/${listing.id}`;

        const listingRow = 
            <tr key={keyId}>
                <td style={listingItemStyle}>{listing.id}</td> 
                <td style={listingItemStyle}>{listing.address}</td> 
                <td style={listingItemStyle}>{listing.askingPrice}</td> 
                <td style={listingItemStyle}>{listing.numberOfBedrooms}</td>
                <td style={listingItemStyle}>{listing.dateListed}</td>
                <td style={listingItemStyle}><a href={editLink}>Edit</a></td>                
                <td style={listingItemStyle}><a href='#' onClick={() => this.deleteListing(listing)}>Delete</a></td>
                <td style={listingItemStyle}><a href={bidLink}>Bid</a></td>
            </tr>; 

        return listingRow; 
    } 

    render() { 

        return(
            <div>

                <div class="row">
                    <div class="col-md-12">
                        <h4>Listing {this.state.listings.length} real estate listings.</h4> 
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <h5>Click <a href='#/addListing/-1'>here</a> to add a new one</h5> 
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                       <table class="table table-responsive listing">
                            <thead>
                                <tr key="headerRow">
                                    <th>Id</th> 
                                    <th>Address</th> 
                                    <th>Asking Price, $</th> 
                                    <th>Number of Bedrooms</th>
                                    <th>Date Listed</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th>Bid</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.listings.map(this.renderListingRow)  
                            }
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        ) 
    }
}

export default Listings;
