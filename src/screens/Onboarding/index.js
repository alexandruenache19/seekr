import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Typography, Colors} from 'react-native-ui-lib';
import {Navigation} from 'react-native-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import LottieView from 'lottie-react-native';

import {Transitions, Service} from '_nav';
import {Constants} from '_styles';

import NumberInput from './screens/NumberInput';
import LocationInput from './screens/LocationInput';
import CodeInput from './screens/CodeInput';
import NameInput from './screens/NameInput';
import UsernameInput from './screens/UsernameInput';
import ProfileImage from './screens/ProfileImage';
import Complete from './screens/Complete';

Navigation.registerComponent(
  'NumberInput',
  () => NumberInput,
  () => NumberInput,
);

Navigation.registerComponent(
  'LocationInput',
  () => LocationInput,
  () => LocationInput,
);

Navigation.registerComponent(
  'CodeInput',
  () => CodeInput,
  () => CodeInput,
);

Navigation.registerComponent(
  'NameInput',
  () => NameInput,
  () => NameInput,
);

Navigation.registerComponent(
  'UsernameInput',
  () => UsernameInput,
  () => UsernameInput,
);

Navigation.registerComponent(
  'ProfileImage',
  () => ProfileImage,
  () => ProfileImage,
);

Navigation.registerComponent(
  'Complete',
  () => Complete,
  () => Complete,
);

const {pushScreen} = Transitions;
const {WIDTH} = Constants;

class Onboarding extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0,
      data: [
        {
          title: 'Discover & buy products in a new way.',
        },
        {
          title: 'Sell anything, to anyone on the internet.',
        },
        {
          title: 'Go live & show items. Chat to buyers & sell.',
        },
      ],
    };
    this.goToPhoneInput = this.goToPhoneInput.bind(this);
  }

  goToPhoneInput() {
    const {activeSlide} = this.state;
    if (activeSlide === 2) {
      pushScreen(Service.instance.getScreenId(), 'NumberInput');
    } else {
      this._carousel.snapToNext();
    }
  }

  _renderItem = ({item, index}) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>

        <View
          style={{
            width: '100%',
            backgroundColor: Colors.black,
            borderRadius: 20,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {index === 0 ? (
            <LottieView
              style={{width: '100%'}}
              source={require('./animation-buy.json')}
              autoPlay
              loop
            />
          ) : index === 1 ? (
            <LottieView
              style={{width: '100%'}}
              source={require('./animation-sell.json')}
              autoPlay
              loop
            />
          ) : (
            <LottieView
              style={{width: '100%'}}
              source={require('./animation-live.json')}
              autoPlay
              loop
            />
          )}
        </View>
      </View>
    );
  };
  render() {
    const {data, activeSlide} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Pagination
            dotsLength={3}
            activeDotIndex={activeSlide}
            containerStyle={styles.containerDot}
            dotStyle={styles.dotStyle}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
          <Text style={{paddingHorizontal: 40, ...styles.buttonText}}>
            seekr.
          </Text>
        </View>

        <Carousel
          ref={c => (this._carousel = c)}
          data={data}
          enableSnap
          enableMomentum
          renderItem={this._renderItem}
          inactiveSlideScale={0.6}
          activeAnimationType={'decay'}
          onSnapToItem={index => this.setState({activeSlide: index})}
          sliderWidth={WIDTH}
          itemWidth={WIDTH}
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={this.goToPhoneInput}>
            <Text style={{...styles.buttonText, color: '#FFF'}}>
              {activeSlide === 2 ? 'Get Started' : 'Next'}
            </Text>
            <FontAwesome name={'arrow-right'} color={'#FFF'} size={24} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  slide: {
    flex: 1,
    padding: 40,
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.text30BL,
    color: Colors.black,
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
    color: Colors.black,
  },
  footer: {
    width: '100%',
    paddingHorizontal: 40,
  },
  dotStyle: {
    width: 15,
    height: 15,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: '#000',
  },
  containerDot: {
    justifyContent: 'flex-start',
  },
});

export default Onboarding;
