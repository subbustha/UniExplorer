import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import CollegeLogo from "../../../assets/logo.page/logo.png";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    width: "95%",
    height: "100%",
  },
});

const AboutPage = () => {
  return (
    <View style={styles.container}>
     <Image source={CollegeLogo} style={{ width: 100, height: 100, marginVertical:20 }} />
      <ScrollView style={styles.scrollView}>
        <Text style={{ textAlign: "justify" }}>
          'Islington Guide' is an application which provides indoor navigation
          of 'Islington College'. We understand that it is not easy to find out
          classes. So we present you with your guide. For the usage of this
          application, you can only use your college mail provided to you. It is
          an easy-to-use application. You can view building information, search
          classes, search your lost items and view your profile. In order to
          search for classes, please, follow the following steps:
        </Text>
        <Text style={{ textAlign: "justify" }}>
          1. Open thisapplication with your account.
        </Text>
        <Text style={{ textAlign: "justify" }}>
          2. After your success verification and log in, you will view the
          homepage where you have to click the hamburger icon.
        </Text>
        <Text style={{ textAlign: "justify" }}>3. Click 'Map'.</Text>
        <Text style={{ textAlign: "justify" }}>
          4. You can see the map and its search bar then click on it.
        </Text>
        <Text style={{ textAlign: "justify" }}>
          5. Type the name of your class and click on the result you desire.
        </Text>
        <Text style={{ textAlign: "justify" }}>
          6. The class will be pointed on the map. Your location will be
          pointed.
        </Text>
        <Text style={{ textAlign: "justify" }}>
          7. Path will be shown and you have to follow it.
        </Text>
        <Text style={{ textAlign: "justify" }}>
          8. After reaching the ground level of the building in which your class
          is located, you will be given a description of the class. For example;
          go to the second floor and turn right.
        </Text>
        <Text style={{ textAlign: "justify" }}>
          9 .Finally, you are at the doorstep of your class.
        </Text>
      </ScrollView>
    </View>
  );
};

export default AboutPage;
