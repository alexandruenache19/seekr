import React, {PureComponent} from 'react';
import {SafeAreaView, View, StyleSheet, Text, FlatList} from 'react-native';

import {ButtonWithIcon} from '_atoms';
import {LiveButton, EventCard, HomeHeader, CreateEventCard} from '_molecules';

// const data = [
//   {
//     id: 'cosmetics',
//     title: 'Maria Cosmetics Sale',
//     videoURL:
//       'https://drive.google.com/u/0/uc?id=1Y1Yc-okuzvIUVkhpiRH9qgdONMOZcZv_&export=download',
//     day: '8',
//     month: 'June',
//     time: '12 PM',
//   },
//   {
//     id: 'clothes',
//     title: 'Maria Cosmetics Sale',
//     videoURL:
//       'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4',
//     day: '16',
//     month: 'June',
//     time: '12 PM',
//   },
//   {
//     id: 'clothess',
//     title: 'Maria Cosmetics Sale',
//     videoURL:
//       'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4',
//     day: '22',
//     month: 'June',
//     time: '12 PM',
//   },
// ];
const data = [];

class Home extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem({item}) {
    return (
      <View style={{marginRight: 20}}>
        <EventCard item={item} />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <HomeHeader />
          <View style={{marginTop: 30}}>
            <LiveButton />
          </View>

          {data.length > 0 ? (
            <View>
              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View>
                  <Text style={{fontSize: 14}}>Check your</Text>
                  <Text style={{fontSize: 24, fontWeight: 'bold'}}>
                    Live Events
                  </Text>
                </View>
                <ButtonWithIcon
                  iconType="Feather"
                  iconName={'plus'}
                  iconSize={20}
                  iconColor={'#FFF'}
                  style={{
                    padding: 10,
                    backgroundColor: '#000',
                    borderRadius: 10,
                  }}
                  onPress={this.switchCamera}
                />
              </View>
              <FlatList
                horizontal={true}
                data={data}
                style={{marginTop: 20}}
                renderItem={this.renderItem}
                keyExtractor={item => item.id}
              />
            </View>
          ) : (
            <View style={{marginTop: 30}}>
              <CreateEventCard />
            </View>
          )}
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
    padding: 20,
    flex: 1,
  },
});

export default Home;
