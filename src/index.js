import 'babel-polyfill';

import SampleVectorMap from './SampleVectorMap.js';

const tileURL = 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

let vm = new SampleVectorMap('map', tileURL, attribution);
