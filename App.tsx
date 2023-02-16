import { StyleSheet, Text, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { createStackNavigator } from "@react-navigation/stack";

import { Duolingo, assets as DuolingoAssets } from 'screens/Duolingo';
import { LoadAssets } from 'components/LoadAssets';

type Routes = {
  Duolingo: undefined;
}

const fonts = {
  "Nunito-Bold": require("assets/fonts/NunitoSans-Bold.ttf"),
  "Nunito-Italic": require("assets/fonts/NunitoSans-Italic.ttf"),
  "Nunito-Regular": require("assets/fonts/NunitoSans-Regular.ttf"),
};

const Stack = createStackNavigator<Routes>();
const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Duolingo"
      component={Duolingo}
      options={{
        title: "🦉 Duolingo",
      }}
    />
  </Stack.Navigator>
);

function App() {
  return (
    <LoadAssets assets={DuolingoAssets} fonts={fonts}>
      <AppNavigator />
    </LoadAssets>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

export default App;
