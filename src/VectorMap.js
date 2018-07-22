import L from 'leaflet';
import 'leaflet.vectorgrid';

import './VectorMap.css';

export default class VectorMap {
  constructor (settings) {
    this.bind();

    this.map = L.map(settings.mapId);
    this.map.on('click', this.mapOnClick);
    this.map.setView({lat: 47.040182144806664, lng: 9.667968750000002}, 5);

    this.layerGroup = L.layerGroup().addTo(this.map);
  }

  setupTileLayer(tileURL, attribution) {
    let tileLayer = L.tileLayer(tileURL, {
      attribution: attribution,
      opacity: 1
    });
    tileLayer.addTo(this.layerGroup);

    return tileLayer;
  }

  setupVectorGridLayer(jsonFile, options) {
    const defaultOptions = {
      rendererFactory: L.svg.tile,
      vectorTileLayerStyles: {
        sliced: this.stylePolygon
      },
      interactive: true,
      getFeatureId: (f) => {
        return this.polygonId(f.properties);
      }
    };

    let opts = Object.assign({}, defaultOptions);
    Object.assign(opts, options);

    return fetch(jsonFile).then((response) => {
      return response.json();
    }).then((polygon) => {
      let vectorGridLayer = L.vectorGrid.slicer(polygon, opts);
      vectorGridLayer.on('mouseover', this.polygonOnMouseOver);
      vectorGridLayer.addTo(this.layerGroup);

      patchVectorGridLayer(vectorGridLayer);

      return vectorGridLayer;
    });
  }

  bind() {
    this.stylePolygon = this.stylePolygon.bind(this);
    this.mapOnClick = this.mapOnClick.bind(this);
    this.polygonOnMouseOver = this.polygonOnMouseOver.bind(this);
  }

  mapOnClick(e) {}
  polygonOnMouseOver(e) {}
  stylePolygon(properties, zoom) {return null;}
  polygonId(properties) {return null;}
}

function patchVectorGridLayer(obj) {
  // Fix error for point data.
  // eg. mouseover does not work without this.
  obj._createLayer_orig = obj._createLayer;
  obj._createLayer = function(feat, pxPerExtent, layerStyle) {
    let layer = this._createLayer_orig(feat, pxPerExtent, layerStyle);
    if (feat.type === 1) {
      layer.getLatLng = null;
    }
    return layer;
  };
}
