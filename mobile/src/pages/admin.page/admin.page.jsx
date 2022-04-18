import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { createUserAccount, getAllAdmins } from "../../utils/api/user-api";
import AdminCard from "./admin.card";
import { SMART_LOGIN } from "../register.page/regiser.constant";

const {
  label: {
    email: { emailRegex },
    password: { passwordRegex },
    fullName: { fullNameRegex },
  },
} = SMART_LOGIN;

const AdminPage = () => {
  const [createAdminMode, setCreateAdminMode] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminList, setAdminList] = useState([]);

  useEffect(() => {
    getAllAdminsViaApi();
  }, []);

  const handleAdminCreate = () => {
    if (!adminName || !adminEmail || !adminPassword) {
      return Alert.alert("Rquirement", "All fields must be entered.");
    }
    if (!fullNameRegex.test(adminName)) {
      return Alert.alert("Name", nameInvalidMessage);
    }
    if (!emailRegex.test(adminEmail)) {
      return Alert.alert("Email", "Should be a valid Islington Email.");
    }
    if (!passwordRegex.test(adminPassword)) {
      return Alert.alert(
        "Password",
        " At least one uppercase, lowercase, number and 8 to 25 characters long."
      );
    }
    createUserAccount({
      email: adminEmail,
      password: adminPassword,
      fullName: adminName,
    })
      .then((result) => {
        if (result) {
          setCreateAdminMode(false);
          setAdminEmail("");
          setAdminPassword("");
          setAdminName("");
          getAllAdminsViaApi();
        } else {
          Alert.alert("Warning", "You are not permitted for this action.");
        }
      })
      .catch((e) => Alert.alert("Error", "Something went wrong."));
  };

  const getAllAdminsViaApi = () => {
    getAllAdmins()
      .then((result) => setAdminList(result ? result : []))
      .catch();
  };

  return (
    <View style={{ width:"100%",height:"100%", alignItems: "center", borderWidth:1 }}>
      <View style={{ width: "95%", alignItems: "center" }}>
        <Text style={{ color: "red", marginTop: 10 }}>
          This page can only be changed by super admin.
        </Text>
        <Pressable
          style={{
            flexDirection: "row",
            paddingVertical: 10,
            paddingHorizontal: 20,
            alignItems: "center",
            backgroundColor: "white",
            marginVertical: 20,
            borderRadius: 10,
          }}
          onPress={() => setCreateAdminMode(true)}
        >
          <MaterialIcons name="admin-panel-settings" size={24} color="black" />
          <Text>Create New Admin</Text>
        </Pressable>
        {createAdminMode && (
          <View style={{ width: "100%" }}>
            <TextInput
              mode="outlined"
              label="Admin Name"
              value={adminName}
              onChangeText={setAdminName}
            />
            <TextInput
              mode="outlined"
              label="Admin Email"
              value={adminEmail}
              onChangeText={setAdminEmail}
            />
            <TextInput
              mode="outlined"
              label="Admin Password"
              textContentType="password"
              value={adminPassword}
              onChangeText={setAdminPassword}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
                height: 24,
                marginVertical: 10,
              }}
            >
              <Pressable
                style={{
                  backgroundColor: "green",
                  padding: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                }}
                onPress={handleAdminCreate}
              >
                <MaterialIcons name="check-circle" size={24} color="white" />
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: "red",
                  padding: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                }}
                onPress={() => {
                  setAdminEmail("");
                  setAdminPassword("");
                  setAdminName("");
                  setCreateAdminMode(false);
                }}
              >
                <MaterialIcons name="cancel" size={24} color="white" />
              </Pressable>
            </View>
          </View>
        )}
        <Text
          style={{
            fontSize: 20,
            textDecorationLine: "underline",
            marginVertical: 20,
          }}
        >
          Current Admins
        </Text>
        <ScrollView style={{ width: "100%",height:"70%" }}>
            {adminList.map((each, index) => (
              <AdminCard
                key={index}
                getAllAdminsViaApi={getAllAdminsViaApi}
                adminName={each.fullName}
                adminEmail={each.email}
              />
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default AdminPage;
