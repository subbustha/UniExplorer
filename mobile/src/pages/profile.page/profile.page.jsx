import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";


const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    getUserInfoFromStorage();
  }, []);

  const getUserInfoFromStorage = async () => {
    const {
      SMART_LOGIN: {
        label: { USER_TOKEN },
      },
    } = registerConstants;
    try {
      const user = JSON.parse(await AsyncStorage.getItem(USER_TOKEN));
      if (user) {
        setUserInfo(user);
      }
    } catch (error) {}
  };

  const handleFullNameSlicing = (fullName) => {
    const nameSplit = fullName.split(" ");
    if (nameSplit.length === 1) {
      return fullName.charAt(0) + "" + fullName.charAt(1);
    } else if (nameSplit.length >= 2) {
      return nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
    }
    return "";
  };

  if (!userInfo) {
    return (
      <View
        style={{
          width: "100%",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Cannot load user information.</Text>
      </View>
    );
  } else {
    const { email = "", fullName = "", emailVerified = false } = userInfo;
    return (
      <View
        style={{
          width: "100%",
          flex: 1,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 150,
            height: 150,
            backgroundColor: "black",
            marginTop: 50,
            borderRadius: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 80 }}>
            {fullName ? handleFullNameSlicing(fullName) : "N/A"}
          </Text>
        </View>
        <Text style={{ marginTop: 50, fontWeight:"bold", fontSize:20 }}>{fullName}</Text>
        <Text>{email}</Text>
      </View>
    );
  }
};

export default ProfilePage;
