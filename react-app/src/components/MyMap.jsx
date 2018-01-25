/* eslint-disable no-unused-vars*/
import React, {
  Component
} from 'react'
/* eslint-enable no-unused-vars*/
import {
  connect
} from 'react-redux';
import {
  bindActionCreators
} from 'redux'
import fetchAvailableCountries from '../actions/action-fetch-available-countries';
import {
  selectCountry
} from '../actions/action-select-country';
import {
  adminStyle
} from '../helpers/helper-admins-style';
import {
  onEachAdminFeature
} from '../helpers/helper-admin-onEach';
import {
  selectAdmin
} from '../actions/action-select-admin';
import {
  countryStyle
} from '../helpers/helper-countries-style';
import {
  onEachCountryFeature
} from '../helpers/helper-country-onEach';
import {
  pointToLayer
} from '../helpers/helper-country-point';
import {
  GeoJSON,
  Map,
  ZoomControl,
  TileLayer
} from 'react-leaflet'
import {
  alpha3ToAlpha2
} from 'i18n-iso-countries';
import {
  fetchDates
} from '../actions/action-fetch-dates.js'
import Docker from './Dock'
import UnicefNav from './UnicefNav';
import LoadingSpinner from './LoadingSpinner'
import MarkerClusterGroup from 'react-leaflet-markercluster';
import clusterMajority from '../helpers/helper-cluster-majority';
import L from 'leaflet';
import './css/custom_cluster.css'
const _ = require('lodash');
// require('react-leaflet-markercluster/dist/styles.min.css'); // inside .js file

/**
 * My map class
 */
class MyMap extends Component {
  /**
   * State object
   * @param  {object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      url: 'https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?' +
        'access_token=' +
        'pk.eyJ1IjoiYXlhbmV6IiwiYSI6ImNqNHloOXAweTFveWwzM3A4M3FkOWUzM2UifQ.' +
        'GfClkT4QxlFDC_xiI37x3Q',
      attribution: '&copy; <a href=\'http://osm.org/copyright\'>OpenStreetMap</a>' +
        ' contributors ',
      lat: 0,
      lng: 0,
      zoom: 2,
      docker: false,
      value: 3,
      didUpdate: false,
      loading: false
    }
  }

  /**
   * componentWillMount - Calls initialLoad which loads initial data
   *
   */
  componentWillMount() {
    this.props.fetchAvailableCountries();
  }
  /**
   * componentWillUpdate
   * @param  {Object} nextProps
   * @param  {Object} nextState
   */
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.activeCountry.selectedCountryName !==
      this.props.activeCountry.selectedCountryName) {
      this.setState({
        didUpdate: false
      })
    }
  }
  /**
   * componentWillMount
   * @param  {Object} prevProps
   * @param  {Object} prevState
   */
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.activeCountry.selectedCountryName !==
      this.props.activeCountry.selectedCountryName) {
      console.log('END');
      if (this.state.docker) {
        this.setState({
          didUpdate: true,
          loading: false
        })
      } else {
        this.setState({
          loading: false
        })
      }
    }
  }

  /**
   * geoFilter - filters geojson file
   *
   * @param  {type} feature features
   * @return {type}         description
   */
  geoFilter(feature) {
    // If at country level
    if (feature.id) {
      let alpha2 = alpha3ToAlpha2(feature.id);
      if (this.props.availableCountries.indexOf(alpha2) > -1) {
        return true
      }
      return false
    }
    return true
  }

  /**
   * Render
   * @return {object} JSX
   */
  render() {
    const position = [this.state.lat, this.state.lng]
    const clusterOptions = {
      maxClusterRadius: 40,
      disableClusteringAtZoom: 12,
      iconCreateFunction: function(cluster) {
        // console.log(cluster.getAllChildMarkers());
        let avg = clusterMajority(cluster.getAllChildMarkers())
        if (avg == 'above') {
          return L.divIcon({
            html: `<span>${cluster.getChildCount()}</span>`,
            className: 'marker-cluster-custom-high',
            iconSize: L.point(40, 40, true),
          });
        } else if (avg == 'below') {
          return L.divIcon({
            html: `<span>${cluster.getChildCount()}</span>`,
            className: 'marker-cluster-custom-low',
            iconSize: L.point(40, 40, true),
          });

        } else if (avg == 'zero') {
          return L.divIcon({
            html: `<span>${cluster.getChildCount()}</span>`,
            className: 'marker-cluster-custom-zero',
            iconSize: L.point(40, 40, true),
          });
        } else if (avg == 'null') {
          return L.divIcon({
            html: `<span>${cluster.getChildCount()}</span>`,
            className: 'marker-cluster-custom-null',
            iconSize: L.point(40, 40, true),
          });
        }

      },
    }

    // console.log(this.props.activeCountry.geojson);
    return (
      <div>
        <UnicefNav></UnicefNav>
        <Map ref='map'
          center={position}
          zoom={this.state.zoom}
          zoomControl={false}>
          <ZoomControl position='bottomleft' />
          <TileLayer
            url={this.state.url}
            attribution={this.state.attribution}
          />
          <GeoJSON
            key={_.uniqueId()}
            data={this.props.allCountries}
            style={countryStyle(this.props)}
            onEachFeature={onEachCountryFeature(
              this, this.props.sliderValues.sliderVal
            )}
            filter={this.geoFilter.bind(this)}
          ></GeoJSON>
          <GeoJSON
            key={_.uniqueId()}
            data={this.props.activeCountry.polygons}
            style={adminStyle(this.props)}
            onEachFeature={onEachAdminFeature(this.props)}
            filter={this.geoFilter.bind(this)}
          ></GeoJSON>
          <MarkerClusterGroup markers={this.props.activeCountry.clusterPoints} options={clusterOptions} />
          {/* <GeoJSON
            key={_.uniqueId()}
            data={this.props.activeCountry.points}
            pointToLayer={pointToLayer(this.props.sliderValues.sliderVal)}
          ></GeoJSON> */}

        </Map>
        <Docker didUpdate={this.state.didUpdate}></Docker>
        <LoadingSpinner display={this.state.loading}></LoadingSpinner>
      </div>
    )
  }
}


/* eslint-disable require-jsdoc*/
function mapStateToProps(state) {
  return {
    availableCountries: state.availableCountries.availableCountries,
    allCountries: state.allCountries,
    activeCountry: state.activeCountry,
    sliderValues: state.sliderChanged

  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchAvailableCountries: fetchAvailableCountries,
    fetchDates: fetchDates,
    selectCountry: selectCountry,
    selectAdmin: selectAdmin
  }, dispatch)
}

/* eslint-enablerequire-jsdoc*/

export default connect(mapStateToProps, matchDispatchToProps)(MyMap);