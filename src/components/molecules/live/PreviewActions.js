import React, {PureComponent} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Card, Typography} from 'react-native-ui-lib';

import {Icon} from '_atoms';
import {ItemDetailsDialog} from '_molecules';

class ActionsSection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
    };

    this.addItem = this.addItem.bind(this);
    this.completeAddItem = this.completeAddItem.bind(this);
  }

  addItem() {
    this.dialog.showDialog();
  }

  completeAddItem() {
    this.setState({complete: true});
  }

  render() {
    const {complete} = this.state;
    return (
      <Card
        useNative
        enableShadow
        borderRadius={10}
        elevation={20}
        onPress={this.addItem}
        activeScale={0.96}
        backgroundColor="#282B28"
        style={styles.container}>
        <Text style={{...Typography.text50, color: '#FFF'}}>
          {complete ? 'Done' : 'Add First Item'}
        </Text>
        <Icon
          iconType={'Feather'}
          iconName={'plus-square'}
          iconColor={'#FFF'}
          iconSize={30}
        />
        <ItemDetailsDialog
          callback={this.completeAddItem}
          ref={r => (this.dialog = r)}
        />
      </Card>
    );
  }
}

export default ActionsSection;

const styles = StyleSheet.create({
  container: {
    height: '10%',
    width: '100%',
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});
