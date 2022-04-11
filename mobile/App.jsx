import React, { useState } from "react";
import "react-native-gesture-handler";
import MapPage from "./src/pages/map.page/map.page";
import RegisterPage from "./src/pages/register.page/register.page";
import HomePage from "./src/pages/home.page/home.page";
import LogoPage from "./src/pages/logo.page/logo.page";
import LostAndFoundPage from "./src/pages/lostandfound.page/lostandfound.page";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { logOutUser } from "./src/auth/authentication";
import CollegeLogo from "./assets/logo.page/logo.png";
import ProfilePage from "./src/pages/profile.page/profile.page";
import FeedbackPage from "./src/pages/feeback.page/feedback.page";
import AboutPage from "./src/pages/about.page/about.page";

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
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerNavigatorLogo {...props} />}
    >
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
