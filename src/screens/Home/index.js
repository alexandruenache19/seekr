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

import {ButtonWithIcon} from '_atoms';
import {LiveButton, EventCard, HomeHeader, CreateEventCard} from '_molecules';
import {FetchingActions} from '_actions';
import {Service, Transitions} from '_nav';

const {getEventInfo} = FetchingActions;
const {pushScreen} = Transitions;

class Home extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {eventInfo: null, data: []};
    this.renderItem = this.renderItem.bind(this);
    this.createEvent = this.createEvent.bind(this);
  }

  async componentDidMount() {
    const {user} = this.props;
    if (user && user.hasOwnProperty('events') && user.events.current) {
      const eventInfo = await getEventInfo(user.events.current);
      this.setState({
        data: [eventInfo],
      });
    }
  }

  renderItem({item}) {
    return (
      <View style={{marginRight: 20}}>
        <EventCard item={item} />
      </View>
    );
  }

  createEvent() {
    const {user} = this.props;
    pushScreen(Service.instance.getScreenId(), 'CreateEvent', {uid: user.uid});
  }

  render() {
    const {data} = this.state;
    const {user} = this.props;
    const {info} = user;

    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView style={styles.container}>
          <HomeHeader info={info} />

          <View style={{marginTop: 30}}>
            <LiveButton />
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
                onPress={this.createEvent}
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
        </ScrollView>
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

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
