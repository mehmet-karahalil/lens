import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
import 'react-native-gesture-handler';
import Camera from './companents/camera/Camera';
import {Provider} from 'react-redux';
import {store, persistor} from './store/Store';
import favorites from './pages/favorites';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {PersistGate} from 'redux-persist/integration/react';

const BottomTabs = createBottomTabNavigator();

function App(): React.JSX.Element {
  const [showHeader, setShowHeader] = useState(true);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <BottomTabs.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: showHeader,
            }}>
            <BottomTabs.Screen
              name="Home"
              component={Camera}
              options={{
                title: 'Home',
                headerTitleAlign: 'center',
                tabBarIcon: ({color, size}) => (
                  <Icon name="home" color={color} size={size} />
                ),
              }}
            />
            <BottomTabs.Screen
              name="Favorites"
              component={favorites}
              options={{
                title: 'Favorites',
                headerShown: true,
                tabBarIcon: ({color, size}) => (
                  <Icon name="cards-heart" color={color} size={size} />
                ),
              }}
            />
          </BottomTabs.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
