import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Text,
  FlatList,
} from 'react-native';
import {Typography} from 'react-native-ui-lib';
import database from '@react-native-firebase/database';

import {ButtonWithIcon} from '_atoms';
import {LiveButton, EventCard, HomeHeader, CreateEventCard} from '_molecules';
import {Service, Transitions} from '_nav';

const {pushScreen} = Transitions;

class Home extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {cuurentEventId: null, eventIds: []};
    this.renderItem = this.renderItem.bind(this);
    this.goToCreateEvent = this.goToCreateEvent.bind(this);
  }

  componentDidMount() {
    const {user} = this.props;
    const eventIds = [];

    this.currentEventListener = database()
      .ref(`users/${user.uid}/events/current`)
      .on('value', async snap => {
        if (snap.exists()) {
          const currentEventId = snap.val();

          if (currentEventId) {
            this.setState({
              cuurentEventId: currentEventId,
            });
          }
        } else {
          this.setState({
            cuurentEventId: null,
          });
        }
      });

    this.pastEventsListener = database()
      .ref(`users/${user.uid}/events/past`)
      .orderByValue()
      .limitToLast(20)
      .on('value', snapshot => {
        snapshot.forEach(eventIdSnap => {
          const eventId = eventIdSnap.key;
          eventIds.push(eventId);
        });

        this.setState({
          eventIds: eventIds.reverse(),
        });
      });
  }

  componentWillUnmount() {
    const {user} = this.props;
    database()
      .ref(`users/${user.uid}/events/current`)
      .off('value', this.currentEventListener);
  }

  renderItem({item}) {
    return (
      <View style={{marginRight: 20}}>
        <EventCard eventId={item} />
      </View>
    );
  }

  goToCreateEvent() {
    const {user} = this.props;
    pushScreen(Service.instance.getScreenId(), 'CreateEvent', {uid: user.uid});
  }

  render() {
    const {cuurentEventId, eventIds} = this.state;
    const {user} = this.props;
    const {info} = user;
    if (user && user.info) {
      return (
        <SafeAreaView style={styles.safeContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}>
            <HomeHeader info={info} />

            <View style={{marginTop: 30}}>
              <LiveButton uid={info.uid} />
            </View>

            <View style={{marginTop: 30}}>
              <CreateEventCard uid={user.uid} />
            </View>

            <View style={{paddingBottom: 20}}>
              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {eventIds.length > 0 && (
                  <View>
                    <Text style={Typography.text65L}>your</Text>
                    <Text style={Typography.text40}>Events</Text>
                    <FlatList
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      ListHeaderComponent={
                        cuurentEventId
                          ? this.renderItem({
                              item: cuurentEventId,
                            })
                          : null
                      }
                      data={eventIds}
                      style={{marginTop: 20}}
                      renderItem={this.renderItem}
                      keyExtractor={(item, index) => {
                        if (item) {
                          return item;
                        } else {
                          return index;
                        }
                      }}
                    />
                  </View>
                )}

                {/*  <ButtonWithIcon
                    iconType="Feather"
                    iconName={'plus'}
                    iconSize={20}
                    iconColor={'#FFF'}
                    style={{
                      padding: 10,
                      backgroundColor: '#000',
                      borderRadius: 10,
                    }}
                    onPress={this.createEvent}
                  />*/}
              </View>

              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {/*  <ButtonWithIcon
                    iconType="Feather"
                    iconName={'plus'}
                    iconSize={20}
                    iconColor={'#FFF'}
                    style={{
                      padding: 10,
                      backgroundColor: '#000',
                      borderRadius: 10,
                    }}
                    onPress={this.createEvent}
                  />*/}
              </View>
              {/*      {eventIds.length > 0 && (
                      <View>
                        <Text style={Typography.text65L}>upcoming</Text>
                        <Text style={Typography.text40}>Live Events</Text>
                        <FlatList
                          horizontal={true}
                          data={eventIds}
                          style={{marginTop: 20}}
                          renderItem={this.renderItem}
                          keyExtractor={(item, index) => {
                            if (item) {
                              return item;
                            } else {
                              return index;
                            }
                          }}
                        />
                      </View>
                    )}*/}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      return <View />;
    }
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

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
