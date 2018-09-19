import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Lithuania from "./img/Lithuania_flag.png";
import Vilnius from "./img/vilnius.png"

let isOpened = false;

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      places: [],
      isOpened: false
    }
  }

  componentDidMount() {
    this.getVenues()
    this.loadMap()
  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCzljpyjlb7QQTT9pFDmQZyBocTax4vVcA&callback=initMap")
    window.initMap = this.initMap
  }

  //Foursquare
  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/search?"
    const paramameters = {
      client_id:"KNZIJFPS4OL04W2M11JK31OKYK0ID4B1EAXTG0Z51PUPLEVO",
      client_secret:"LHTSMZYLC4JCUZDEEWZSHFRKA32IEJKN25OE2JRTPO5ELHPT",
      query:"drinks, food",
      near:"Vilnius",
      v:"20180918"
    }

    //Get locations
    axios.get (endPoint + new URLSearchParams(paramameters))
      .then(response => {
        this.setState({
          places: response.data.response.venues
        })
      })
      .catch(error => {
        console.log("Something went wrong!" + error)
      })
  }
  //GoogleMaps
  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 54.678308, lng: 25.286932},
        zoom: 12
      })

    const infowindow = new window.google.maps.InfoWindow()

    this.state.places.map(myPlace => {

      const placeName = `<h3>${myPlace.name}</h3>`
      const placeAddress = `<h4>${myPlace.location.formattedAddress}</h4>`
      const placeInfo = '<a href="https://foursquare.com/v/' + myPlace.id +
            '" target="_blank">Read More on <b>Foursquare Website</b></a>';

      //Markers
      const marker = new window.google.maps.Marker({
        position: {lat: myPlace.location.lat, lng: myPlace.location.lng},
        map: map,
        animation: window.google.maps.Animation.DROP,
        icon: Lithuania
      })

      //On click open marker
      marker.addListener('click', function() {
        infowindow.setContent(placeName + " " + placeAddress + " " + placeInfo)
        infowindow.open(map, marker);
        //Set animation when clicked
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(() => {marker.setAnimation(null);}, 400)
      });
   });
}

  //Closes and opens sidebar
  toggleSidebar() {
    if (isOpened === false) {
      document.getElementById("sidebar").className="active";
      isOpened = true;
    } else {
      document.getElementById("sidebar").className="toggle-btn";
      isOpened = false;
    }
  };




  render() {
    //PLaces buttons on sidebar
    const names = this.state.places.map(function(item) {return item.name})
    const numberOfButtons = names.length
    const buttons = [];
    let i;
    for(i= 0; i < numberOfButtons; i++){
      buttons.push(
        <li key={i}><button>{names[i]}</button></li>
      );
    }

    return (
      <main>
      <div id="map"></div>
          <div id="sidebar">
            <img src={Vilnius} alt="Vilnius town symbol"></img>
            <div className="search-area">
                <input
                  role="search"
                  aria-labelledby="filter"
                  id="search-field"
                  className="search-input"
                  type="text"
                  placeholder="Filter out locations"
                />
            </div>
            <div className="toggle-btn" onClick={this.toggleSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <ul>
              <li onClick={this.setMarkerActive}>
                {buttons}
              </li>
            </ul>
          </div>
      </main>
    );
  }
}

function loadScript(url) {
  const index = window.document.getElementsByTagName("script")[0]
  const script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;
