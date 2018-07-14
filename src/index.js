import 'babel-polyfill';

import L from 'leaflet';
import 'leaflet.vectorgrid';

import './index.css';

import euCountriesJson from './eu-countries.json';
var request = new XMLHttpRequest();
request.open("GET", euCountriesJson, false);
request.send(null);
var euCountries = JSON.parse(request.responseText);

var map = L.map('map');

var cartodbAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
  attribution: cartodbAttribution,
  opacity: 1
}).addTo(map);

var highlight;
var polygonStyle = function(mapcolor7, forHighlight) {
  var p = mapcolor7 % 5;
  return {
    fillColor: p === 0 ? '#800026' :
      p === 1 ? '#E31A1C' :
      p === 2 ? '#FEB24C' :
      p === 3 ? '#B2FE4C' : '#FFEDA0',
    fillOpacity: forHighlight ? 1 : 0.5,
    stroke: true,
    fill: true,
    color: forHighlight ? 'red' : 'black',
    opacity: 1,
    weight: forHighlight ? 2 : 0
  };
};
var clearHighlight = function() {
  if (highlight) {
    vectorGrid.resetFeatureStyle(highlight);
  }
  highlight = null;
};
var highlightPolygon = function(e) {
  var properties = e.layer.properties;
  L.popup()
    .setContent(properties.name || properties.type)
    .setLatLng(e.latlng)
    .openOn(map);

  clearHighlight();
  highlight = properties.wb_a3;

  var style = polygonStyle(properties.mapcolor7, true);
  vectorGrid.setFeatureStyle(properties.wb_a3, style);
};
var fillPolygon = function(properties, zoom) {
  return polygonStyle(properties.mapcolor7, false);
};
var vectorGrid = L.vectorGrid.slicer( euCountries, {
  rendererFactory: L.svg.tile,
  vectorTileLayerStyles: {
    sliced: fillPolygon
  },
  interactive: true,
  getFeatureId: function(f) {
    return f.properties.wb_a3;
  }
})
    .on('mouseover', highlightPolygon)
    .addTo(map);

map.on('click', clearHighlight);

map.setView({ lat: 47.040182144806664, lng: 9.667968750000002 }, 5);
