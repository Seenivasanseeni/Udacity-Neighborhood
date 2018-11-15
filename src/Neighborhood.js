import React,{Component} from 'react'
import {APIKey} from "./APIKey";
import './Neighborhood.css'

export  class Neighborhood extends Component{
    render(){
        return <div className="Neighborhood">
            <div className="col-sm-20">
                <input type="text" placeholder="Enter Place Name " />
                <div className="search-results">
                    <ol>

                    </ol>
                </div>
            </div>
            <div id="map" className="col-sm-80 map"></div>

        </div>
    }
}