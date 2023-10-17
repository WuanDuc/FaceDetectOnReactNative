
import FONTS from '../constants/font';
import {Dimensions, View} from 'react-native';
import MainScreen from '../screens/MainScreen';
import ShowImageScreen from '../screens/ShowImageScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export function RootNavigation() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ShowScreen"
        component={ShowImageScreen}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
