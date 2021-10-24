import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import {Typography, Colors} from 'react-native-ui-lib';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//map
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';

import {AuthActions} from '_actions';
import {Transitions, Service} from '_nav';

const {pushScreen} = Transitions;
const {updateLocation} = AuthActions;
navigator.geolocation = require('@react-native-community/geolocation');

class LocationInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
      },
      address: '',
    };

    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeMarker = this.onChangeMarker.bind(this);
    this.confirmLocation = this.confirmLocation.bind(this);
    this.getAddressFromCoords = this.getAddressFromCoords.bind(this);
  }

  componentDidMount() {
    Geolocation.getCurrentPosition(async info => {
      const coords = info.coords;
      if (coords) {
        const lat = coords.latitude;
        const long = coords.longitude;
        const address = await this.getAddressFromCoords(lat, long);

        this.setState({
          region: {
            latitude: lat,
            longitude: long,
          },
          address: address,
        });
      }
    });
  }

  onChangeAddress(data, details) {
    this.setState({
      region: {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      },
      address: data.description,
    });
  }

  async onChangeMarker(e) {
    const lat = e.nativeEvent.coordinate.latitude;
    const long = e.nativeEvent.coordinate.longitude;
    const address = await this.getAddressFromCoords(lat, long);

    this.setState({
      region: {
        latitude: lat,
        longitude: long,
      },
      address: address,
    });
  }

  async getAddressFromCoords(lat, long) {
    const response = await fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        lat +
        ',' +
        long +
        '&key=' +
        'AIzaSyAa7WR_TE327kaJRYzJQQrC682th-aus2I',
    );
    const responseJson = await response.json();
    const results = responseJson.results;

    if (results && results.length > 0) {
      const result = results[0];
      const address = result.formatted_address;
      this.autocomplete.setAddressText(address);

      return address;
    }

    return '';
  }

  confirmLocation() {
    const {uid} = this.props;
    const {address, region} = this.state;
    const coords = {
      lat: region.latitude,
      long: region.longitude,
    };

    updateLocation(uid, coords, address);
    pushScreen(Service.instance.getScreenId(), 'NameInput', {uid: uid});
  }

  render() {
    const {address, region} = this.state;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.safeContainer}>
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>What is your address?</Text>

            <View
              style={{
                height: '30%',
                overflow: 'hidden',
                borderRadius: 20,
                marginBottom: 40,
              }}>
              <MapView
                style={{...StyleSheet.absoluteFill}}
                region={{
                  ...region,
                  latitudeDelta: 0.003,
                  longitudeDelta: 0.003,
                }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton={true}>
                <Marker
                  onDragEnd={this.onChangeMarker}
                  draggable
                  coordinate={region}
                />
              </MapView>
            </View>

            <View style={{height: '40%'}}>
              <GooglePlacesAutocomplete
                ref={r => (this.autocomplete = r)}
                placeholder="your address..."
                currentLocation={true}
                currentLocationLabel="Current location"
                minLength={2}
                autoFocus={true}
                fetchDetails={true}
                listViewDisplayed={false}
                enablePoweredByContainer={false}
                currentLocation={true}
                currentLocationLabel="Current location"
                onPress={this.onChangeAddress}
                query={{
                  key: 'AIzaSyAa7WR_TE327kaJRYzJQQrC682th-aus2I',
                  language: 'en',
                }}
                styles={{
                  textInput: {
                    ...Typography.text60,
                    backgroundColor: Colors.grey60,
                    borderRadius: 10,
                  },
                  description: {
                    ...Typography.text65,
                    color: Colors.grey20,
                  },
                }}
              />
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.confirmLocation}>
                <Text style={styles.buttonText}>Next</Text>
                <FontAwesome name={'arrow-right'} color={'#FFF'} size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  title: {
    ...Typography.text30BL,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    ...Typography.text50,
    color: Colors.white,
  },
  footer: {
    width: '100%',
    marginBottom: 50,
  },
});

export default LocationInput;
