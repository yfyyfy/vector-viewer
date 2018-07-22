import VectorMap from '../VectorMap.js';

export default class SampleVectorMap2 extends VectorMap {
  constructor (settings) {
    super(settings);

    this.setupTileLayer(settings.tileURL, settings.attribution);
    this.setupVectorGridLayer(settings.jsonFile)
      .then((layer) => {this.vectorGridLayer = layer;});
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

  polygonId(properties) {
    return properties.BRK_A3;
  }

  setHighlight(polygon) {
    if (this.setHighlight.highlightedPolygon) {
      let id = this.polygonId(this.setHighlight.highlightedPolygon.properties);
      this.vectorGridLayer.resetFeatureStyle(id);
    }
    this.setHighlight.highlightedPolygon = polygon;
  }

  mapOnClick(e) {
    this.setHighlight();
  }

  polygonOnMouseOver(e) {
    // Highlight polygon
    const properties = e.layer.properties;
    L.popup()
      .setContent(properties.NAME || properties.TYPE)
      .setLatLng(e.latlng)
      .openOn(this.map);

    this.setHighlight(e.layer);

    const style = this.polygonStyle(properties.MAPCOLOR7, true);
    this.vectorGridLayer.setFeatureStyle(this.polygonId(properties), style);
  }

  stylePolygon(properties, zoom) {
    return this.polygonStyle(properties.MAPCOLOR7, false);
  };
}
