var myMap = L.map("map", {center:[40.73, -114], zoom:5});

L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  }).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function mag_color(mag){
  if (mag > 5) {
    return "#ff0000"
  } else if (mag > 4) {
    return "#ff3300"
  } else if (mag >3) {
    return "#ff6600"
  } else if (mag >2) {
    return "#ff9900"
  } else if (mag >1) {
    return "#ffCC00"
  } else {
    return "#ffff00"
  }
};

function onEachFeature(feature,layer){
  layer.bindPopup(feature.properties.title)
};

d3.json(url, function(data){
  console.log(data);  
  L.geoJson(data,{
    pointToLayer: function (feature,latlng){
    // circle marker having different color and size per magnitude
      return L.circleMarker(latlng,{
        radius: feature.properties.mag*3,
        fillColor: mag_color(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      })
    },
    onEachFeature: onEachFeature
  }).addTo(myMap);

  var legend = L.control({position:'bottomright'});
  legend.onAdd = function(myMap){
    var div = L.DomUtil.create('div','info legend'),
        grades = [0,1,2,3,4,5],
        labels=[];
    for (var i=0; i<grades.length;i++){
      div.innerHTML += 
      '<i style="background:' + mag_color(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
})

// popup and legend