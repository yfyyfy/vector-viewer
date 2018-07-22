// import VectorMap from './SampleVectorMap.js';
// import countryJson from '../data/eu-countries.json';
import VectorMap from './SampleVectorMap2.js';
import countryJson from '../data/ne_110m_admin_0_countries.geojson';

let vm = new VectorMap({
  mapId: 'map',
  tileURL: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  jsonFile: countryJson
});
