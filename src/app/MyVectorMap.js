import VectorMap from '../VectorMap.js';
import countryJson from '../data/ne_110m_admin_0_countries.geojson';
import tinyCountryJson from '../data/ne_110m_admin_0_tiny_countries.geojson';

export default class SampleVectorMap extends VectorMap {
  constructor (settings) {
    super({mapId: 'map'});

    let tileURL = 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png';
    let attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

    this.setupTileLayer(tileURL, attribution);
    this.setupVectorGridLayer(countryJson)
      .then((layer) => {this.vectorGridLayer = layer;});
    this.setupVectorGridLayer(tinyCountryJson)
      .then((layer) => {this.vectorGridLayer2 = layer;});
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

  parentLayer(layer) {
    let layers = Object.values(layer._eventParents);
    let parents = layers.filter((l) => this.layerGroup.hasLayer(l));

    if (parents.length != 1) {
      throw new Error('More than one parents are found for a layer.');
    }

    return parents[0];
  }

  polygonId(properties) {
    return properties.BRK_A3;
  }

  setHighlight(polygon) {
    if (this.setHighlight.highlightedPolygon) {
      let parents = this.layerGroup.getLayers();
      let id = this.polygonId(this.setHighlight.highlightedPolygon.properties);
      parents.forEach((e) => {
        e.resetFeatureStyle && e.resetFeatureStyle(id);
      });
    }
    this.setHighlight.highlightedPolygon = polygon;
  }

  mapOnClick(e) {
    this.setHighlight();
  }

  polygonOnMouseOver(e) {
    // Highlight polygon
    const properties = e.layer.properties;

    if (this.polygonOnMouseOver.polygon) {
      let isSamePolygon = this.polygonId(this.polygonOnMouseOver.polygon.properties) === this.polygonId(properties);
      let isPopupOpen = this.polygonOnMouseOver.popup && this.polygonOnMouseOver.popup.isOpen();
      if (isSamePolygon && isPopupOpen) {
        return;
      }
    }
    this.polygonOnMouseOver.polygon = e.layer;

    this.polygonOnMouseOver.popup = L.popup()
      .setContent(properties.NAME || properties.TYPE)
      .setLatLng(e.latlng)
      .openOn(this.map);

    this.setHighlight(e.layer);

    let parent = this.parentLayer(e.layer);
    const style = this.polygonStyle(properties.MAPCOLOR7, true);
    parent.setFeatureStyle(this.polygonId(properties), style);
  }

  polygonOnClick(e) {
    const properties = e.layer.properties;
    console.log(':' + this.polygonId(properties));
  }

  stylePolygon(properties, zoom) {
    return this.polygonStyle(properties.MAPCOLOR7, false);
  };
}
