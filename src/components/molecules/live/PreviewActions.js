import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Typography, Card} from 'react-native-ui-lib';
import LinearGradient from 'react-native-linear-gradient';

import {Icon} from '_atoms';

class PreviewActionsSection extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Card onPress={this.props.callback} style={styles.card}>
          <LinearGradient
            colors={['#6A4087', '#C94573']}
            useAngle
            angle={270}
            angleCenter={{x: 0.7, y: 0.5}}
            style={styles.cardContainer}>
            <Text style={styles.buttonText}>Go live</Text>
            <Icon
              iconType="Feather"
              iconName="video"
              iconColor="#FFF"
              iconSize={28}
            />
          </LinearGradient>
        </Card>
      </View>
    );
  }
}

export default PreviewActionsSection;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 15,
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  buttonText: {
    ...Typography.text50,
    color: '#FFF',
  },
  cardContainer: {
    width: '100%',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    alignItems: 'center',
  },
});
