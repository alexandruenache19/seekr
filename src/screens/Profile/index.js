import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  FlatList,
  Dimensions,
} from 'react-native';
import {Keyboard, Typography, Colors} from 'react-native-ui-lib';
import Video from 'react-native-video';
import {Navigation} from 'react-native-navigation';
import moment from 'moment';
import database from '@react-native-firebase/database';
import {Transitions, Service} from '_nav';
import {
  InputWithLabel,
  ButtonWithText,
  ButtonWithIcon,
  ButtonWithTextIcon,
} from '_atoms';
import FastImage from 'react-native-fast-image';
import {Constants} from '_styles';
import {OrderItems, ProductDialog} from '_molecules';
import auth from '@react-native-firebase/auth';
const windowWidth = Dimensions.get('window').width;

class Profile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      orders: [],
      userInfo: {},
    };
    this.renderHeader = this.renderHeader.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderOrderItem = this.renderOrderItem.bind(this);
  }

  componentDidMount() {
    const {user} = this.props;

    this.currentEventListener = database()
      .ref(`users/${user.uid}/shop`)
      .on('value', async snap => {
        var shop = snap.val();
        if (shop.hasOwnProperty('products')) {
          this.setState({
            products: Object.values(shop.products),
          });
        }
        if (shop.hasOwnProperty('orders')) {
          this.setState({
            orders: Object.values(shop.orders),
          });
        }
      });

    this.currentEventListener = database()
      .ref(`users/${user.uid}/info`)
      .on('value', async snap => {
        var userInfo = snap.val();
        this.setState({userInfo: userInfo});
      });
  }

  renderItem({item}) {
    return (
      <TouchableOpacity
        style={{
          width: windowWidth * 0.3,
          height: windowWidth * 0.3,
          borderRadius: 10,
        }}
        onPress={() => this.productDialog.showDialog(item)}>
        <FastImage
          style={{
            height: '100%',
            width: '100%',
            borderRadius: 10,
          }}
          source={{uri: item.imageUrl}}
        />
      </TouchableOpacity>
    );
  }

  renderOrderItem({item}) {
    return (
      <TouchableOpacity
        style={{
          width: windowWidth * 0.45,
          backgroundColor: '#272D2D',
          padding: 10,
          borderRadius: 10,
        }}
        onPress={() => this.dialog.showDialog(item)}>
        <Text style={{...Typography.text70BO, color: '#FFF'}}>
          {item.info.name}
        </Text>
      </TouchableOpacity>
    );
  }

  renderHeader() {
    const {userInfo, orders} = this.state;
    return (
      <View>
        <ButtonWithTextIcon
          style={{alignSelf: 'flex-end'}}
          iconName="sign-out"
          iconType="FontAwesome"
          iconSize={22}
          iconColor={'#000'}
          text="sign out"
          iconAfterText
          textStyle={{...Typography.text70, paddingRight: 5}}
          onPress={() => auth().signOut()}
        />
        <View
          style={{
            // flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <FastImage
            style={{
              height: 100,
              width: 100,
              borderRadius: 50,
            }}
            source={{
              uri: userInfo && userInfo.imageURL ? userInfo.imageURL : null,
            }}
          />

          <Text style={Typography.text40}>@{userInfo.username}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{...Typography.text60}}>Orders</Text>
          {/*  <ButtonWithText textStyle={Typography.text70} text="view all" />*/}
        </View>

        <FlatList
          data={orders}
          style={{flex: 1, width: '100%'}}
          numColumns={2}
          columnWrapperStyle={{
            flex: 1,
            justifyContent: 'space-between',
            marginTop: 10,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderOrderItem}
          keyExtractor={(item, index) => index}
        />
        <Text style={{...Typography.text60, marginTop: 20}}>Products</Text>
      </View>
    );
  }

  render() {
    const {products, orders} = this.state;
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={{flex: 1, padding: 10}}>
          <ProductDialog ref={ref => (this.productDialog = ref)} />
          <OrderItems ref={ref => (this.dialog = ref)} />

          <FlatList
            data={products}
            ListHeaderComponent={this.renderHeader}
            style={{flex: 1, width: '100%'}}
            numColumns={3}
            columnWrapperStyle={{
              flex: 1,
              justifyContent: 'space-evenly',
              marginTop: 10,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.id + index}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
});

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
