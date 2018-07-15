import L from 'leaflet';
import 'leaflet.vectorgrid';

import './VectorMap.css';

export default class VectorMap {
  constructor (mapId, tileURL, attribution) {
    this.bind();

    this.map = L.map(mapId);
    this.setupTileLayer(tileURL, attribution);

    const jsonFile = require('./eu-countries.json');
    const request = new XMLHttpRequest();
    request.open("GET", jsonFile, false);
    request.send(null);
    const polygon = JSON.parse(request.responseText);
    this.setupVectorGridLayer(polygon);

    this.map.on('click', this.mapOnClick);
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
        sliced: this.stylePolygon
      },
      interactive: true,
      getFeatureId: function(f) {
        return f.properties.wb_a3;
      }
    });
    this.vectorGridLayer.on('mouseover', this.polygonOnMouseOver);
    this.vectorGridLayer.addTo(this.map);
  }

  bind() {
    this.stylePolygon = this.stylePolygon.bind(this);
    this.mapOnClick = this.mapOnClick.bind(this);
    this.polygonOnMouseOver = this.polygonOnMouseOver.bind(this);
  }

  mapOnClick(e) {}
  polygonOnMouseOver(e) {}
  stylePolygon(properties, zoom) {return null;};
}
