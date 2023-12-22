import {Dimensions} from 'react-native';
// const designWidth = 1080;
const designHeight = 910;
// function scale(number) {
//   return (number * Dimensions.get('window').width) / designWidth;
// }

function scale(number) {
  return (number * Dimensions.get('window').height) / designHeight;
}

export default scale;
