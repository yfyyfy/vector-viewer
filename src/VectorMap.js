import L from 'leaflet';
import 'leaflet.vectorgrid';

import './VectorMap.css';

export default class VectorMap {
  constructor (settings) {
    this.bind();

    this.map = L.map(settings.mapId);
    this.map.on('click', this.mapOnClick);
    this.map.setView({lat: 47.040182144806664, lng: 9.667968750000002}, 5);

    this.setupTileLayer(settings.tileURL, settings.attribution);
    this.setupVectorGridLayer(settings.jsonFile);
  }

  setupTileLayer(tileURL, attribution) {
    this.tileLayer = L.tileLayer(tileURL, {
      attribution: attribution,
      opacity: 1
    });
    this.tileLayer.addTo(this.map);
  }

  setupVectorGridLayer(jsonFile) {
    let options = {
      rendererFactory: L.svg.tile,
      vectorTileLayerStyles: {
        sliced: this.stylePolygon
      },
      interactive: true,
      getFeatureId: (f) => {
        return f.properties.wb_a3;
      }
    };

    fetch(jsonFile).then((response) => {
      return response.json();
    }).then((polygon) => {
      this.vectorGridLayer = L.vectorGrid.slicer(polygon, options);
      this.vectorGridLayer.on('mouseover', this.polygonOnMouseOver);
      this.vectorGridLayer.addTo(this.map);
    });
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
