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
import database from '@react-native-firebase/database';
import {Transitions, Service} from '_nav';
import {ButtonWithIcon, ButtonWithText} from '_atoms';
import {OrderItems} from '_molecules';

class Onboarding extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      totalRevenue: 0,
      orderCurrency: '',
    };
    this.goBack = this.goBack.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.goToUserOrder = this.goToUserOrder.bind(this);
  }

  componentDidMount() {
    const {eventInfo} = this.props;

    this.ordersListener = database()
      .ref(`events/${eventInfo.id}/orders`)
      .on('value', snapshot => {
        let currentOrders = [];
        let totalRevenue = 0;
        let orderCurrency = '';
        snapshot.forEach(orderSnap => {
          const order = orderSnap.val();
          let revenue = 0;
          let productsPacked = 0;
          let totalProducts = 0;
          let currency = '';
          const {products} = order;

          for (const key in products) {
            const product = products[key];
            if (product.isPacked) {
              productsPacked++;
            }
            totalProducts++;
            revenue += product.priceToPay || 0;
            currency = product.currency;
          }

          order.revenue = revenue;
          order.productsPacked = productsPacked;
          order.totalProducts = totalProducts;
          order.currency = currency;
          orderCurrency = currency;
          totalRevenue += revenue;
          currentOrders.push(order);
        });

        this.setState({
          orders: currentOrders,
          totalRevenue: totalRevenue,
          orderCurrency: orderCurrency,
        });
      });
  }

  componentWillUnmount() {
    const {eventInfo} = this.props;

    database()
      .ref(`events/${eventInfo.id}/orders`)
      .off('value', this.ordersListener);
  }

  goBack() {
    Navigation.pop(Service.instance.getScreenId());
  }

  goToUserOrder(item) {
    const {eventInfo} = this.props;
    this.dialog.showDialog(item, eventInfo.id);
  }

  renderItem({item}) {
    const {info, products} = item;

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
          <View>
            <Text style={{...Typography.text60, color: Colors.white}}>
              {info.name}
            </Text>

            <Text style={{...Typography.text70, color: Colors.white}}>
              Total: {item.revenue} {item.currency}
            </Text>
          </View>

          <ButtonWithText
            style={{...styles.button, backgroundColor: '#FFF'}}
            text={`${item.productsPacked} / ${item.totalProducts}`}
            textStyle={Typography.text70BL}
            // iconType="Feather"
            // iconName={info.status === 'pending' ? '' : 'check'}
            // iconSize={22}
            // iconColor={'#000'}
            onPress={() => this.goToUserOrder(item)}
          />
        </View>
      </Card>
    );
  }

  render() {
    const {orders, totalRevenue, orderCurrency} = this.state;

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
          <Text style={Typography.text40}>
            Total: {totalRevenue} {orderCurrency}
          </Text>
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
