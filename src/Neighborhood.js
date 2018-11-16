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
        locations:[],
        allLocations:[{
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
        this.getSearchResults=this.getSearchResults.bind(this);
        this.createInfoWindow=this.createInfoWindow.bind(this);
        this.clickMarkerHandler=this.clickMarkerHandler.bind(this);
    }

    initializeMap(){
        this.map=new window.google.maps.Map(document.getElementById('map'),{
            center: this.state.center.position,
            zoom:14
        })
        this.infoWindow=new  window.google.maps.InfoWindow({
            content:''
        })
        this.initializeMarkers()
    }
    initializeMarkers(){
        this.state.locations.map(location=>{
            this.createMarker(location)
        })

    }
    updateMarkers(){
        //hide all markers
        this.state.allLocations.map(location=>{
            location.marker.setMap(null);
        })
        //show all markers for only filtered results
        this.state.locations.map(location=>{
            location.marker.setMap(this.map);
        })

    }
    createMarker(location){
        var marker=new window.google.maps.Marker({
            map:this.map,
            position: location.position,
            title: location.text,
            animation: window.google.maps.Animation.DROP
        })
        marker.addListener('click',(event)=>{
            this.createInfoWindow(location,marker);
        })
        if(!location.marker){
            location.marker=marker;
        }
    }
    createInfoWindow(location,marker){
        //display temporary text;
        this.infoWindow.setContent(`${location.text}<br/>Details are Loading....`);
        this.infoWindow.open(this.map, marker);
        var auth=`&client_id=LVJO54D0VKC0UELX4IA43NT4YWFIUBW0O05B0VRA41LQ2J43&client_secret=IRZUEGSPHK4OM3JNVVNPTPFU0BAX4ALOUU4NU0P05QGNE0RX&v=20190101`
        fetch(`https://api.foursquare.com/v2/venues/search?ll=${location.position.lat},${location.position.lng}&&radius=20&intent=browse&${auth}`).then(response=>{
                return response.json();
        }).then(data=> {
            var venues = data.response.venues;
            var bestLocation = venues[0]; //choose the first location
            return  fetch(`https://api.foursquare.com/v2/venues/${bestLocation.id}?${auth}`);
        }).then(response=>response.json()).then(data=>{
            var venue=data.response.venue;
            if(data.meta.code>=200&&data.meta.code<300){
                    var name=venue.name;
                    var url=venue.canonicalUrl;
                    var address=venue.location.address;
                    var rating=venue.rating;
                    if(!rating)
                        rating=5.0;
                    rating+='/10'
                    var content=`<h6>Name:${name}</h6><p>Address:${address}</p><i>Rating:${rating}</i><br/><a href="${url}"> Visit FourSquarePage</a>"`
                    this.infoWindow.setContent(content);
                    this.infoWindow.open(this.map, marker);
            }
        })

    }
    componentDidMount(){
        if(this.debug)
            console.log("Component Did Mount");
        var script=document.createElement('script');
        script.src=`https://maps.googleapis.com/maps/api/js?key=${APIKey}&libraries=places&v=3`;
        script.async=true;
        script.defer=true;
        script.addEventListener('load',()=>{
            console.log("Google Maps API script loaded");
            this.setState({mapReady: true,locations:this.state.allLocations},this.initializeMap)
        })
        document.body.appendChild(script);
    }
    render(){
        return <div className="Neighborhood  row">
            <div className="col-sm-3 full-height">
                <div className="form-group">
                    <input type="text" placeholder="Enter Place Name "  onChange={this.updateQueryHandler} value={this.state.query} className="form-control" tabIndex={1}/>
                </div>
                <div className="search-results">
                    <ol className="list-group">
                        {
                            this.state.locations.map((location,index)=>{
                                return <a key={location.text} className="list-group-item list-group-item-action" href="#" onFocus={()=>{this.clickMarkerHandler(location)}} tabIndex={index+3}>
                                        {location.text}
                                </a>
                            })
                        }
                    </ol>
                </div>
            </div>
            <div id="map" className="col-sm-9 map full-height" tabIndex={2}></div>
        </div>
    }

    clickMarkerHandler(location) {
        this.createInfoWindow(location,location.marker);
    }

    updateQueryHandler(evt) {
        if(this.debug){
            console.log("Update query Handler",evt.target.value);
        }
        this.setState({
            query: evt.target.value,
            locations: this.getSearchResults(evt.target.value)
        },()=>{
            this.updateMarkers();
        })

    }

    getSearchResults(query) {
        var resultLocations=this.state.allLocations.filter(location=>(location.text.toLowerCase().indexOf(query.toLowerCase())!=-1));
        return resultLocations;
    }
    componentDidUpdate(){
        if(this.debug)
            console.log("Component Did Update");

    }

}