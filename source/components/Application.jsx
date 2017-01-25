import React from 'react';

class Application extends React.Component {

    constructor(props) {
        super(props);
    } 

    render() {
        return (
            
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            {/* entry point */} 
                            {this.props.children}
                        </div>
                    </div>
                </div>

            </div>
            
        );
    }
}

export default Application;
