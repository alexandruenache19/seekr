import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Dialog,
  PanningProvider,
  MaskedInput,
  Typography,
  Colors,
} from 'react-native-ui-lib';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-toast-message';
import FastImage from 'react-native-fast-image';

import {ButtonWithIcon, ButtonWithTextIcon} from '_atoms';
import {ShareActions} from '_actions';

const {shareProduct} = ShareActions;

class ShareDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDialog: false,
      copied: false,
      currentPosition: 0,
      product: {},
    };
    this.copy = this.copy.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);

    this.share = this.share.bind(this);
  }

  showDialog(item) {
    this.setState({showDialog: true, product: item});
  }

  hideDialog() {
    this.setState({showDialog: false});
    this.props.callback && this.props.callback();
  }

  copy() {
    const {product} = this.state;
    this.setState(
      {
        copied: true,
      },
      async () => {
        Clipboard.setString(`https://seekrlive.com/p/${product.id}`);
        Toast.show({
          type: 'success',
          text1: 'Copied',
          text2: 'Coppied to your clipboard',
          position: 'bottom',
        });
        setTimeout(() => {
          this.hideDialog();
        }, 1000);
      },
    );
  }

  async share() {
    const {product} = this.state;
    try {
      await shareProduct(product);
    } catch (e) {
      console.log(e);
    } finally {
      this.hideDialog();
    }
  }

  render() {
    const {showDialog, copied, product} = this.state;

    return (
      <Dialog
        migrate
        useSafeArea
        ignoreBackgroundPress
        key={'dialog-key'}
        bottom={true}
        height={'80%'}
        panDirection={PanningProvider.Directions.DOWN}
        containerStyle={styles.container}
        visible={showDialog}
        onDismiss={this.hideDialog}>
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: 20,
          }}>
          <ButtonWithIcon
            iconType={'Feather'}
            iconName={'chevron-down'}
            iconColor={'#000'}
            iconSize={30}
            onPress={this.hideDialog}
          />
          <View style={{paddingLeft: 10, flex: 1}}>
            <Text style={{...Typography.text40, paddingBottom: 10}}>Share</Text>
          </View>
        </View>
        <Text style={{...Typography.text70, paddingBottom: 10}}>
          {product.name}
        </Text>
        <FastImage
          style={{
            height: 300,
            width: '100%',
            borderRadius: 20,
          }}
          source={{uri: product.imageUrl}}
        />
        <Text style={{...Typography.text60, paddingBottom: 10}}>
          Price: {product.price}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <ButtonWithTextIcon
            style={{
              justifyContent: 'space-between',
              backgroundColor: '#777',
              padding: 10,
              borderRadius: 10,
            }}
            textStyle={{
              ...Typography.text70BL,
              color: Colors.white,
            }}
            textContainerStyle={{
              padding: 5,
            }}
            iconType="Feather"
            iconName={copied ? 'check-square' : 'copy'}
            iconSize={26}
            iconColor={Colors.white}
            iconAfterText
            onPress={this.copy}
            text={`${'seekrlive.com/p/... '}${copied ? '' : 'Copy'}`}
          />

          <ButtonWithIcon
            style={{
              backgroundColor: '#000',
              padding: 10,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginLeft: 10,
            }}
            iconType={'Feather'}
            iconName={'more-horizontal'}
            iconColor={'#FFF'}
            iconSize={30}
            onPress={this.share}
          />
        </View>

        <Toast ref={ref => Toast.setRef(ref)} />
      </Dialog>
    );
  }
}

export default ShareDialog;

const styles = StyleSheet.create({
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
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 20,
    padding: 20,
    justifyContent: 'space-between',
    flex: 1,
  },
});
