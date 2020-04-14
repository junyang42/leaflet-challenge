var map = L.map("map", {
    center: [8.9475, 125.5406],
    zoom: 3
  });
  
// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.streets-basic",
accessToken: API_KEY
}).addTo(map);

// choose the dataset of M4.5+ Earthquakes for past 7 days
// add url and read url
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

d3.json(url, function(data){
    // console.log(data);
    var data_features = data.features;
    console.log(data_features);

    let geoArray = [];
    
    for (feature of data_features) {
        if (feature.geometry.coordinates) {
            // console.log(feature.geometry.coordinates);
            var coordinate_list = feature.geometry.coordinates;
            var a = coordinate_list.slice(0,2);
            // notice that the coordinate_list contains extra info (the depth of earthquake)
            // also notice the coordinate order is listed as long and lat, 
            // while we need the order of lat and long
            var coordinateEach = [coordinate_list[1], coordinate_list[0]];
            console.log(coordinateEach);

            var magnitude = feature.properties.mag;
            var place = feature.properties.place;
            var radius = Math.pow(magnitude, 3);
            console.log(radius);

            // function markerColor(magnitudeN) {
            //     if (magnitudeN > 7) {
            //         return "#4d3d00";
            //     }
            //     else if (magnitudeN > 6) {
            //         return "#665200";
            //     }
            //     else if (magnitudeN > 5.5) {
            //         return "#cc6600";
            //     }
            //     else if (magnitudeN > 5) {
            //         return "#ffcc00";
            //     }
            //     else {
            //         return "#aaff00";
            //     }
            //   }

            function getColor(d) {
                return d >= 7.5 ? '#800026' :
                       d >= 6.7 ? '#BD0026' :
                       d >= 6.1 ? '#E31A1C' :
                       d >= 5.6 ? '#FC4E2A' :
                       d >= 5.2 ? '#FD8D3C' :
                       d >= 4.8 ? '#FEB24C' :
                       d >= 4.5 ? '#FED976' :
                                  '#FFEDA0';
            }


            L.circle(coordinateEach, {
            radius: radius * 1200,
            // color: getColor(magnitude),
            fillColor: getColor(magnitude),
            // fillOpacity: 1,

            weight: 2,
            opacity: 1,
            color: '#666699',
            // dashArray: '3',
            fillOpacity: 0.7

            })
            .bindPopup("<h1>" + "magnitude: " + magnitude + "</h1> <hr> <h3> " + place +  "</h3>")
            .addTo(map);           

            // push the coordinate of each earthquake back to the array
            geoArray.push(coordinateEach);    
        }
    }
    // console.log(geoArray);

    // add legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [4.5, 4.8, 5.2, 5.6, 6.1, 6.7, 7.5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 0.01) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

       
});


