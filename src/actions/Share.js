import Share from 'react-native-share';
import moment from 'moment';
export const shareOnFB = async item => {
  const day = moment(item.timestamp).format('DD');
  const month = moment(item.timestamp).format('MMMM');

  const options = {
    title: item.title,
    message: `Join me live on ${day} ${month} on Seekr`,
    url: `https://seekr-live.herokuapp.com/e/${item.id}`,
    social: Share.Social.FACEBOOK,
  };

  Share.shareSingle(options);
};

export const share = async item => {
  const day = moment(item.timestamp).format('DD');
  const month = moment(item.timestamp).format('MMMM');

  const options = {
    title: item.title,
    message: `Join me live on ${day} ${month}`,
    url: `https://seekr-live.herokuapp.com/e/${item.id}`,
    social: Share.Social.FACEBOOK,
  };

  Share.open(options);
};
