import AppDispatcher from '../dispatcher/AppDispatcher'; 

const obj = {  

    fetchListings: function() {

         let action = {
            type: 'fetch_listings' 
        }; 
        
        AppDispatcher.dispatch(action); 
    },

    fetchListing: function(listingId) {

         let action = {
            type: 'fetch_listing', 
            id: listingId  
        }; 
        
        AppDispatcher.dispatch(action); 
    }, 

    updateListing: function(listing) {

         let action = {
            type: 'update_listing', 
            listing: listing 
        }; 
        
        AppDispatcher.dispatch(action); 
    },  

    addNewListing: function(listing) {

         let action = {
            type: 'add_new_listing', 
            listing: listing 
        }; 
        
        AppDispatcher.dispatch(action); 
    }, 

    deleteListing: function(id) {

         let action = {
            type: 'delete_listing', 
            id: id 
        }; 
        
        AppDispatcher.dispatch(action); 
    }, 

    resetLastOffer: function() {

         let action = {
            type: 'reset_last_offer' 
        }; 
        
        AppDispatcher.dispatch(action); 
    },

    validateOffer: function(id, offerAmount) {

         let action = {
            type: 'validate_offer', 
            id: id, 
            amount: offerAmount 
        }; 
        
        AppDispatcher.dispatch(action); 
    }

}; 

export default obj; 
