import React,{Component} from 'react'
import {APIKey} from "./APIKey";
import './Neighborhood.css'

export  class Neighborhood extends Component{
    state={
        query:'',
        locations:[],
        mapReady:false
    }

    constructor(props) {
        super(props);
        this.debug=true;
        this.setState=this.setState.bind(this);
        this.updateQueryHandler=this.updateQueryHandler.bind(this);
    }

    initializeMap(){
        var bangalore= {
            position: {lat: 12.9716, lng: 77.5946},
            text: 'Bangalore Main'
        }
        var map=new window.google.maps.Map(document.getElementById('map'),{
            center: bangalore.position,
            zoom:8
        })
    }
    componentDidMount(){
        if(this.debug)
            console.log("Component Did Mount");
        var script=document.createElement('script');
        script.src=`https://maps.googleapis.com/maps/api/js?key=${APIKey}&libraries=places`;
        script.async=true;
        script.defer=true;
        script.addEventListener('load',()=>{
            console.log("Google Maps API script loaded");
            this.setState({mapReady: true},this.initializeMap())
        })
        document.body.appendChild(script);
    }
    render(){
        return <div className="Neighborhood">
            <div className="col-sm-30 full-height">
                <input type="text" placeholder="Enter Place Name "  onChange={this.updateQueryHandler} />
                <div className="search-results">
                    <ol>

                    </ol>
                </div>
            </div>
            <div id="map" className="col-sm-70 map full-height"></div>
        </div>
    }

    updateQueryHandler(evt) {
        if(this.debug){
            console.log("Update query Handler",evt.target.value);
        }
        this.setState({
            query: evt.target.value
        })
    }
    componentDidUpdate(){
        if(this.debug)
            console.log("Component Did Update");

    }
}