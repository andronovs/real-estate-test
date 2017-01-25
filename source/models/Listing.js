class Listing {

    constructor(id, address, askingPrice, numberOfBedrooms, dateListed, maxBid) {
        this.id = arguments.length? id : -1; 
        this.address = arguments.length? address : ""; 
        this.askingPrice = arguments.length? askingPrice : 0; 
        this.numberOfBedrooms = arguments.length? numberOfBedrooms : 0; 
        this.dateListed = arguments.length? dateListed : new Date(); 
        this.maxBid = arguments.length? maxBid : 0; 
    }
}

export default Listing; 
