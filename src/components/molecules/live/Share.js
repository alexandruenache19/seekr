import React, {PureComponent} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Typography, Colors} from 'react-native-ui-lib';

import {ButtonWithTextIcon, ButtonWithIcon} from '_atoms';
import {ItemDetailsDialog} from '_molecules';

class ActionsSection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
    };
    this.copy = this.copy.bind(this);
  }

  copy() {
    this.setState({
      copied: true,
    });
  }

  render() {
    const {copied} = this.state;
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{...Typography.text40, color: Colors.white}}>Share</Text>
          <ButtonWithTextIcon
            // style={{width: '100%', justifyContent: 'space-between'}}
            containerStyle={{justifyContent: 'space-between', borderRadius: 20}}
            textStyle={{
              ...Typography.text60M,
              color: Colors.white,
            }}
            textContainerStyle={{
              borderRadius: 5,
              padding: 5,
              marginRight: 10,
              backgroundColor: Colors.grey50,
            }}
            iconType="Feather"
            iconName={copied ? 'check-square' : 'copy'}
            iconSize={20}
            iconColor={'#FFF'}
            iconStyle={{backgroundColor: '#222', padding: 5, borderRadius: 5}}
            iconAfterText
            onPress={this.copy}
            text={copied ? 'Copied' : 'www.seekr.io/maria'}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            paddingBottom: 10,
            justifyContent: 'space-between',
          }}>
          <ButtonWithIcon
            iconType={'FontAwesome'}
            iconName={'facebook'}
            iconColor={'#FFF'}
            iconSize={30}
          />
          <ButtonWithIcon
            iconType={'FontAwesome'}
            iconName={'whatsapp'}
            iconColor={'#FFF'}
            iconSize={30}
          />
          <ButtonWithIcon
            iconType={'FontAwesome'}
            iconName={'twitter'}
            iconColor={'#FFF'}
            iconSize={30}
          />
          <ButtonWithIcon
            iconType={'FontAwesome'}
            iconName={'instagram'}
            iconColor={'#FFF'}
            iconSize={30}
          />
          <ButtonWithIcon
            iconType={'FontAwesome'}
            iconName={'share-alt-square'}
            iconColor={'#FFF'}
            iconSize={30}
          />
        </View>
      </View>
    );
  }
}

export default ActionsSection;

const styles = StyleSheet.create({
  container: {
    height: '20%',
    backgroundColor: '#F4A261',
    width: '100%',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
});
