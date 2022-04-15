import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import MapPage from "./src/pages/map.page/map.page";
import RegisterPage from "./src/pages/register.page/register.page";
import HomePage from "./src/pages/home.page/home.page";
import LogoPage from "./src/pages/logo.page/logo.page";
import ProfilePage from "./src/pages/profile.page/profile.page";
import FeedbackPage from "./src/pages/feeback.page/feedback.page";
import AboutPage from "./src/pages/about.page/about.page";
import LostAndFoundPage from "./src/pages/lostandfound.page/lostandfound.page";
import AdminPage from "./src/pages/admin.page/admin.page";

import { logOutUser } from "./src/utils/api/authentication";
import CollegeLogo from "./src/images/logo.page/logo.png";
import { getLocalUserInfo } from "./src/utils/api/constants";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498db",
    accent: "#f1c40f",
    background: "#ffffff",
  },
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigatorLogo = (props) => {
  return (
    <DrawerContentScrollView>
      <View
        style={{
          height: 200,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
          paddingBottom: 20,
          marginHorizontal: 10,
          borderBottomWidth: 2,
        }}
      >
        <Image
          source={CollegeLogo}
          style={{
            width: 150,
            height: 150,
          }}
        />
      </View>

      <DrawerItemList {...props} />
      <View style={{ flex: 1 }}></View>
      <DrawerItem
        label="Logout"
        icon={() => (
          <View style={{ width: 30 }}>
            <FontAwesome name="sign-out" size={30} />
          </View>
        )}
        onPress={() => {
          logOutUser();
          props.navigation.reset({
            index: 0,
            routes: [{ name: "RegisterScreen" }],
          });
        }}
      />
    </DrawerContentScrollView>
  );
};

const ActivityPage = (props) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    getLocalUserInfo()
      .then((user) => setIsAdmin(user ? user.isAdmin : null))
      .catch();
  }, []);

  return (
    <Drawer.Navigator
      initialRouteName={isAdmin ? "Admin" : "Home"}
      drawerContent={(props) => <DrawerNavigatorLogo {...props} />}
    >
      {isAdmin && (
        <Drawer.Screen
          name="Admin"
          component={AdminPage}
          options={{
            drawerIcon: ({ color }) => (
              <View style={{ width: 30 }}>
                <FontAwesome name="lock" size={30} color={color} />
              </View>
            ),
          }}
        />
      )}

      <Drawer.Screen
        name="Home"
        component={HomePage}
        options={{
          drawerIcon: ({ color }) => (
            <View style={{ width: 30 }}>
              <FontAwesome name="home" size={30} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Lost N Found"
        component={LostAndFoundPage}
        options={{
          drawerIcon: ({ color }) => (
            <View style={{ width: 30 }}>
              <FontAwesome name="search" size={30} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Map"
        component={MapPage}
        options={{
          drawerIcon: ({ color }) => (
            <View style={{ width: 30 }}>
              <FontAwesome name="map-marker" size={30} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          drawerIcon: ({ color }) => (
            <View style={{ width: 30 }}>
              <FontAwesome name="user" size={30} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Feedback"
        component={FeedbackPage}
        options={{
          drawerIcon: ({ color }) => (
            <View style={{ width: 30 }}>
              <FontAwesome name="comments" size={30} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="About Us"
        component={AboutPage}
        options={{
          drawerIcon: ({ color }) => (
            <View style={{ width: 30 }}>
              <FontAwesome name="university" size={25} color={color} />
            </View>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <Stack.Navigator initialRouteName="LogoScreen">
          <Stack.Screen
            name="LogoScreen"
            component={LogoPage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterPage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ActivityScreen"
            component={ActivityPage}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}
