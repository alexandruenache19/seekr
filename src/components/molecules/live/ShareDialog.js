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

import {ButtonWithText, ButtonWithIcon, ButtonWithTextIcon} from '_atoms';
import {ShareActions} from '_actions';

const {shareOnFB, share} = ShareActions;

class ShareDialog extends Component {
  constructor(props) {
    super(props);
    const {eventInfo} = props;
    const eventID = eventInfo ? eventInfo.id : '';

    this.state = {
      showDialog: false,
      copied: false,
      currentPosition: 0,
      url: `https://seekrlive.com/e/${eventID}`,
    };
    this.copy = this.copy.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);

    this.shareOnFb = this.shareOnFb.bind(this);
    this.share = this.share.bind(this);
  }

  showDialog() {
    this.setState({showDialog: true});
  }

  hideDialog() {
    this.setState({showDialog: false});
    this.props.callback && this.props.callback();
  }

  copy() {
    const {url} = this.state;
    this.setState({
      copied: true,
    });
    Clipboard.setString(url);
    Toast.show({
      type: 'success',
      text1: 'Copied',
      text2: 'Coppied to your clipboard',
      position: 'bottom',
    });
  }

  shareOnFb() {
    const {eventInfo} = this.props;

    shareOnFB(eventInfo);
  }

  share() {
    const {eventInfo} = this.props;

    share(eventInfo);
  }

  render() {
    const {showDialog, copied, url} = this.state;

    return (
      <Dialog
        migrate
        useSafeArea
        ignoreBackgroundPress
        key={'dialog-key'}
        bottom={true}
        height={'50%'}
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
            <Text style={{...Typography.text40, paddingBottom: 10}}>
              Invite Others
            </Text>

            <Text style={{flexShrink: 1}}>
              Get your group members to join this event to have higher chances
              of selling all your products
            </Text>
          </View>
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#000',
              borderRadius: 10,
              // padding: 10,
              marginBottom: 10,
            }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                flexShrink: 1,
                color: '#FFF',
                ...Typography.text80,
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}>
              {url}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // paddingBottom: 20,
            }}>
            <ButtonWithTextIcon
              style={{
                backgroundColor: '#000',
                padding: 10,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                flex: 1,
                marginRight: 10,
              }}
              textStyle={{
                marginRight: 10,
                color: '#FFF',
                ...Typography.text60,
              }}
              iconType={'FontAwesome'}
              iconName={'facebook'}
              iconColor={'#FFF'}
              iconSize={30}
              iconAfterText
              text={'Post on Faceook'}
              onPress={this.shareOnFb}
            />

            <ButtonWithIcon
              style={{
                backgroundColor: '#000',
                padding: 10,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
              iconType={'Feather'}
              iconName={'more-horizontal'}
              iconColor={'#FFF'}
              iconSize={30}
              onPress={this.share}
            />
          </View>
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
