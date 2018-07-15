import 'babel-polyfill';

import L from 'leaflet';
import 'leaflet.vectorgrid';

import './index.css';

class VectorMap {
  constructor (mapId) {
    this.map = L.map(mapId);
    const tileURL = 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png';
    const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';
    this.setupTileLayer(tileURL, attribution);

    const jsonFile = require('./eu-countries.json');
    const request = new XMLHttpRequest();
    request.open("GET", jsonFile, false);
    request.send(null);
    const polygon = JSON.parse(request.responseText);
    this.setupVectorGridLayer(polygon);

    this.map.on('click', () => this.setHighlight());
    this.map.setView({lat: 47.040182144806664, lng: 9.667968750000002}, 5);
  }

  setupTileLayer(tileURL, attribution) {
    this.tileLayer = L.tileLayer(tileURL, {
      attribution: attribution,
      opacity: 1
    });
    this.tileLayer.addTo(this.map);
  }

  setupVectorGridLayer(polygon) {
    this.vectorGridLayer = L.vectorGrid.slicer(polygon, {
      rendererFactory: L.svg.tile,
      vectorTileLayerStyles: {
        sliced: (properties, zoom) => this.fillPolygon(properties, zoom)
      },
      interactive: true,
      getFeatureId: function(f) {
        return f.properties.wb_a3;
      }
    });
    this.vectorGridLayer.on('mouseover', (e) => this.highlightPolygon(e));
    this.vectorGridLayer.addTo(this.map);
  }

  polygonStyle(mapcolor7, forHighlight) {
    const p = mapcolor7 % 5;
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
  }

  setHighlight(polygon) {
    if (this.setHighlight.highlightedPolygon) {
      this.vectorGridLayer.resetFeatureStyle(this.setHighlight.highlightedPolygon);
    }
    this.setHighlight.highlightedPolygon = polygon;
  }

  highlightPolygon(e) {
    const properties = e.layer.properties;
    L.popup()
      .setContent(properties.name || properties.type)
      .setLatLng(e.latlng)
      .openOn(this.map);

    this.setHighlight(properties.wb_a3);

    const style = this.polygonStyle(properties.mapcolor7, true);
    this.vectorGridLayer.setFeatureStyle(properties.wb_a3, style);
  }

  fillPolygon(properties, zoom) {
    return this.polygonStyle(properties.mapcolor7, false);
  };
}

vm = new VectorMap('map');
