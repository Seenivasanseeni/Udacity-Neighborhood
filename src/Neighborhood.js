import React,{Component} from 'react'
import {APIKey} from "./APIKey";
import './Neighborhood.css'

export  class Neighborhood extends Component{
    state={
        query:'',
        center:{
            position: {lat: 12.9716, lng: 77.5946},
            text: 'Bangalore Main'
        },
        locations:[{
            "position": {
                "lat": 12.97164742807048,
                "lng": 77.59579181671143
            },
            "text": "UB City"
        },
            {
                "position": {
                    "lat": 12.969723691487262,
                    "lng": 77.59347438812256
                },
                "text": "Kanteerva Stadium"
            },
            {
                "position": {
                    "lat": 12.972379280472673,
                    "lng": 77.59504079818726
                },
                "text": "Hotel Bengaluru"
            },
            {
                "position": {
                    "lat": 12.974261176761285,
                    "lng": 77.59707927703857
                },
                "text": "British Council"
            },
            {
                "position": {
                    "lat": 12.973006580817755,
                    "lng": 77.59984731674194
                },
                "text": "Airlines Hotel"
            },
            {
                "position": {
                    "lat": 12.970811022688382,
                    "lng": 77.6010274887085
                },
                "text": "Bank Of India"
            },
            {
                "position": {
                    "lat": 12.965520693505155,
                    "lng": 77.60111331939697
                },
                "text": "HDFC Bank"
            },
            {
                "position": {
                    "lat": 12.972191090060633,
                    "lng": 77.58740186691284
                },
                "text": "Reserve Bank Of India"
            },
            {
                "position": {
                    "lat": 12.981767710239714,
                    "lng": 77.58630752563477
                },
                "text": "Cyber Crime Police"
            },
            {
                "position": {
                    "lat": 12.963387801704663,
                    "lng": 77.58888244628906
                },
                "text": "State Bank Of India"
            },
            {
                "position": {
                    "lat": 12.960692200000016,
                    "lng": 77.59435346000816
                },
                "text": "Axis Bank"
            },
            {
                "position": {
                    "lat": 12.959540185959993,
                    "lng": 77.59325981140137
                },
                "text": "Karnataka Bank"
            }
        ],
        mapReady:false
    }

    constructor(props) {
        super(props);
        this.debug=true;
        this.setState=this.setState.bind(this);
        this.updateQueryHandler=this.updateQueryHandler.bind(this);
        this.populateSearchResuls=this.populateSearchResuls.bind(this);
    }

    initializeMap(){
        this.map=new window.google.maps.Map(document.getElementById('map'),{
            center: this.state.center.position,
            zoom:14
        })
        this.initilizeService()
    }
    initilizeService(){
        if(this.map){
           this.placeService=new window.google.maps.places.PlacesService(this.map);
        }
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
                        {
                            this.state.locations.map(location=>{
                                return <li>
                                        {location.text}
                                </li>
                            })
                        }
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
        this.populateSearchResuls();
    }

    populateSearchResuls() {
        this.placeService.nearbySearch({
            location: this.state.center.position,
            radius:100
        },(data)=>{
            console.log("Nearby Search Done",data);
        })
    }
    componentDidUpdate(){
        if(this.debug)
            console.log("Component Did Update");

    }
}