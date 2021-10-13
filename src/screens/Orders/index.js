import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import {Keyboard, Typography, Colors, Card} from 'react-native-ui-lib';
import Video from 'react-native-video';
import {Navigation} from 'react-native-navigation';

import {Transitions, Service} from '_nav';
import {ButtonWithIcon} from '_atoms';
import {OrderItems} from '_molecules';

class Onboarding extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
    };
    this.goBack = this.goBack.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.goToUserOrder = this.goToUserOrder.bind(this);
  }

  componentDidMount() {
    const {eventInfo} = this.props;
    if (eventInfo && eventInfo.hasOwnProperty('orders')) {
      const ordersObj = eventInfo.orders;
      const ordersArr = Object.values(ordersObj);

      this.setState({orders: ordersArr});
    }
  }

  goBack() {
    Navigation.pop(Service.instance.getScreenId());
  }

  goToUserOrder(item) {
    this.dialog.showDialog(item);
  }

  renderItem({item}) {
    return (
      <Card
        useNative
        enableShadow
        enableBlur
        borderRadius={10}
        elevation={20}
        backgroundColor={'#FF4365'}
        activeScale={0.96}
        onPress={() => this.goToUserOrder(item)}
        style={{...styles.container, marginTop: 20}}>
        <View style={styles.innerContainer}>
          <Text style={{...Typography.text50, color: Colors.white}}>
            {item.info.name}
          </Text>

          <ButtonWithIcon
            style={{...styles.button, backgroundColor: '#FFF'}}
            iconType="Feather"
            iconName={'arrow-right'}
            iconSize={22}
            iconColor={'#000'}
            onPress={() => this.goToUserOrder(item)}
          />
        </View>
      </Card>
    );
  }

  render() {
    const {orders} = this.state;
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <ButtonWithIcon
              style={{paddingRight: 20}}
              iconType={'Feather'}
              iconName={'arrow-left'}
              iconColor={'#000'}
              iconSize={30}
              onPress={this.goBack}
            />
            <Text style={styles.title}>Orders</Text>
          </View>

          <FlatList
            data={orders}
            showsVerticalScrollIndicator={false}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item + index}
          />
          <Text style={Typography.text40}>Total: 330 RON</Text>
        </View>
        <OrderItems ref={ref => (this.dialog = ref)} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  title: {
    ...Typography.text30BL,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  fieldStyle: {
    marginBottom: 40,
  },
  smallText: {
    fontSize: 16,
  },
  button: {
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  video: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    alignItems: 'stretch',
  },
  createVideoContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grey40,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default Onboarding;
