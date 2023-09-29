//Store the API endpoint
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let tectonic = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
  console.log(data.features)
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// here, i create this layergroup to store the popups
let one_markers = new L.LayerGroup();

// this function is to give to every earthquake the size of the circle.
function markerSize(magnitude) {
  return magnitude*30000;
}

// this is to store the data of the tectonic plates and then to put in the overlays.
let tectonicplates = new L.LayerGroup();

// with this function, i created every popup for every earthquake with the specifications of the challenge
function createFeatures(earthquakeData) {

  // with this function i want to add for each feature in the features array a popup that describes the place and time of the earthquake.
  function onEachFeature(feature) {
    // with this if's, i add the color and the circle size to each feature depending of the depth and the magnitude, respectibly.
    if (feature.geometry.coordinates[2]>90){
        L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{
          fillOpacity: 0.90,
          color: "#ee3001",
          fillColor: "#ee3001",
          radius: markerSize(feature.properties.mag)
        }).bindPopup(feature.properties.place+"<hr><br> Date: "+ new Date(feature.properties.time)+"<br> Depth: "+feature.geometry.coordinates[2]+ "<br> Magnitude: "+ feature.properties.mag).addTo(one_markers);
    }  
    else if (feature.geometry.coordinates[2]>70) {
        L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{
          fillOpacity: 0.75,
          color: "#fc8805",
          fillColor: "#fc8805",
          radius: markerSize(feature.properties.mag)
        }).bindPopup(feature.properties.place+"<hr><br> Date: "+ new Date(feature.properties.time)+"<br> Depth: "+feature.geometry.coordinates[2]+ "<br> Magnitude: "+ feature.properties.mag).addTo(one_markers);
    }
    else if (feature.geometry.coordinates[2]>50){
        L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{
          fillOpacity: 0.75,
          color: "#f8bf04",
          fillColor: "#f8bf04",
          radius: markerSize(feature.properties.mag)
        }).bindPopup(feature.properties.place+"<hr><br> Date: "+ new Date(feature.properties.time)+"<br> Depth: "+feature.geometry.coordinates[2]+ "<br> Magnitude: "+ feature.properties.mag).addTo(one_markers);
    }
    else if (feature.geometry.coordinates[2]>30){
        L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{
          fillOpacity: 0.75,
          color: "#f8e804",
          fillColor: "#f8e804",
          radius: markerSize(feature.properties.mag)
        }).bindPopup(feature.properties.place+"<hr><br> Date: "+ new Date(feature.properties.time)+"<br> Depth: "+feature.geometry.coordinates[2]+ "<br> Magnitude: "+ feature.properties.mag).addTo(one_markers);
    }
    else if (feature.geometry.coordinates[2]>10){
        L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{
          fillOpacity: 0.75,
          color: "#bbfd06",
          fillColor: "#bbfd06",
          radius: markerSize(feature.properties.mag)
        }).bindPopup(feature.properties.place+"<hr><br> Date: "+ new Date(feature.properties.time)+"<br> Depth: "+feature.geometry.coordinates[2]+ "<br> Magnitude: "+ feature.properties.mag).addTo(one_markers);
    }
    else {
        L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{
          fillOpacity: 0.75,
          color: "#19fc05",
          fillColor: "#19fc05",
          radius: markerSize(feature.properties.mag)
        }).bindPopup(feature.properties.place+"<hr><br> Date: "+ new Date(feature.properties.time)+"<br> Depth: "+feature.geometry.coordinates[2]+ "<br> Magnitude: "+ feature.properties.mag).addTo(one_markers);
    }
  }

  // here, i create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  //finaly, i call the function which i create the map.
  createMap();
  
}

//with this function, i create the map with the specifications that the challenge need it.
function createMap(){
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  //for this two tiles, you need to have the api_key of mapbox website.
  let satellite = L.tileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token={accesstoken}', {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    accesstoken: API_KEY
  });

  let grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accesstoken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    accesstoken: API_KEY
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Outdoors Map": topo,
    "Satellite Map": satellite,
    "Grayscale Map": grayscale
  };

  // Create the map with our layers.
  let myMap = L.map("map", {
    center: [60.4877, -143.0943],
    zoom: 4,
    layers: [street,one_markers]
  });

  // here, i create the 
  let overlays = {
    Earthquakes:one_markers,
    TectonicPlates: tectonicplates,
  };

  // Create a control for our layers, and add our overlays to it.
  L.control.layers(baseMaps, overlays,{collapsed:false}).addTo(myMap);

  // Create a legend to display information about our map.
  var info = L.control({
    position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend".
  info.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map.
  info.addTo(myMap);
   
  document.querySelector(".legend").innerHTML = [
    '<h3> Earthquake Depth <hr>',
    // the first part of the code, i put into the legend a "square/icon" with the color, and then i put the text that i want.
    "<i style='background: #19fc05' class='info legend leaflet.control'> </i> &nbsp; Depth [-10 to 10]: <p>",
    "<i style='background: #bbfd06' class='info legend leaflet.control'> </i> &nbsp; Depth [10 to 30]:<p>",
    "<i style='background: #f8e804' class='info legend leaflet.control'> </i> &nbsp; Depth [30 to 50]:<p>",
    "<i style='background: #f8bf04' class='info legend leaflet.control'> </i> &nbsp; Depth [50 to 70]:<p>",
    "<i style='background: #fc8805' class='info legend leaflet.control'> </i> &nbsp; Depth [70 to 90]:<p>",
    "<i style='background: #ee3001' class='info legend leaflet.control'> </i> &nbsp; Depth [90 or more]:<p>",
  ].join("");

  // with this, i get the information about tectonic plates and add this information to the layergroup that i create at the begining.
  d3.json(tectonic).then(function(response){
    L.geoJSON(response,{
      color:"#DC143C",
      weight:2
    }).addTo(tectonicplates);
   
  });  
}