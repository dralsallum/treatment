import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Text,
  Image,
  Platform,
} from "react-native";
import * as Linking from "expo-linking";

import {
  userSelector,
  updateUserProfile,
  deleteUser,
  signOut,
} from "../redux/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import StreakIcon from "../../assets/icons/fire.png";
import * as Notifications from "expo-notifications";
import axios from "axios";

// Styled components
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #f9f9f9;
`;

const Header = styled.View`
  background-color: #4b7bec;
  padding: 20px;
  flex-direction: row;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  color: white;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  flex: 1;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  right: 10px;
  top: 20px;
  padding: 10px;
`;

const ProfileContainer = styled.View`
  background-color: white;
  padding: 20px;
  align-items: center;
  margin-bottom: 10px;
`;

const ProfileImage = styled.Image`
  width: 90px;
  height: 90px;
  border-radius: 45px;
  margin-bottom: 15px;
`;

const ProfileText = styled.Text`
  font-size: 18px;
  margin-bottom: 5px;
  font-weight: bold;
`;

const SubText = styled.Text`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 5px;
`;

const SectionHeader = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding: 10px 15px;
  background-color: #f2f2f2;
  text-align: left;
`;

const OptionContainer = styled.View`
  background-color: white;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #e6e6e6;
`;

const OptionRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const OptionText = styled.Text`
  font-size: 16px;
  color: #333;
  text-align: left;
  flex: 1;
`;

const InputField = styled.TextInput`
  border-width: ${(props) => (props.isEditing ? "1px" : "0px")};
  border-color: #ddd;
  padding: ${(props) => (props.isEditing ? "10px" : "0px")};
  margin-top: 5px;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 5px;
  font-size: 16px;
  text-align: right;
`;

const UpdateButton = styled.TouchableOpacity`
  background-color: #4b7bec;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: #ff3b30;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin: 20px 15px;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: 80%;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
`;

const ButtonGroup = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

const NotificationButton = styled(UpdateButton)`
  flex: 1;
  margin-horizontal: 5px;
`;

const SettingsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector(userSelector);
  const profileImage = require("../../assets/images/profile.png");
  const [country, setCountry] = useState(currentUser?.country || "");
  const [city, setCity] = useState(currentUser?.city || "");
  const [language, setLanguage] = useState(currentUser?.language || "");

  const [isEditingCountry, setIsEditingCountry] = useState(false);
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [isEditingLanguage, setIsEditingLanguage] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false);

  const handleToggleNotifications = () => {
    setNotificationModalVisible(true);
  };

  const handleOptInNotifications = async () => {
    try {
      // Check existing permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // If permissions are not granted or are undetermined, request them
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
          android: {},
        });
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "الإشعارات معطلة",
          "لتلقي الإشعارات، يرجى تفعيل الأذونات في الإعدادات.",
          [
            {
              text: "إلغاء",
              style: "cancel",
            },
            {
              text: "فتح الإعدادات",
              onPress: () => {
                // Open app settings
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        return;
      }

      // Permissions granted, proceed to get the token
      const tokenData = await Notifications.getExpoPushTokenAsync();
      const expoPushToken = tokenData.data;

      // Send the expoPushToken to the backend
      if (currentUser && currentUser._id && currentUser.accessToken) {
        const userId = currentUser._id;
        const accessToken = currentUser.accessToken;

        // Make an API call to update the user's profile with the expoPushToken
        await axios.put(
          `https://quizeng-022517ad949b.herokuapp.com/api/users/profile/${userId}`,
          { expoPushToken },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Update the user in Redux
        dispatch(updateUserProfile({ userId, updates: { expoPushToken } }));

        Alert.alert("تم", "تم تفعيل الإشعارات بنجاح.");
      } else {
        console.error("Current user is not defined.");
      }
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      Alert.alert(
        "خطأ",
        "حدث خطأ أثناء تفعيل الإشعارات. يرجى المحاولة لاحقًا."
      );
    } finally {
      setNotificationModalVisible(false);
    }
  };
  const handleOptOutNotifications = () => {
    setNotificationModalVisible(false);
  };
  const handleUpdateCountry = () => {
    if (currentUser && currentUser._id) {
      dispatch(
        updateUserProfile({
          userId: currentUser._id,
          updates: { country },
        })
      );
      setIsEditingCountry(false);
    }
  };

  const handleUpdateCity = () => {
    if (currentUser && currentUser._id) {
      dispatch(
        updateUserProfile({
          userId: currentUser._id,
          updates: { city },
        })
      );
      setIsEditingCity(false);
    }
  };

  const handleEditCountry = () => {
    setIsEditingCountry(true);
  };

  const handleEditCity = () => {
    setIsEditingCity(true);
  };

  const handleEditLanguage = () => {
    setIsEditingLanguage(true);
  };

  const handleUpdateLanguage = () => {
    if (currentUser && currentUser._id) {
      dispatch(
        updateUserProfile({
          userId: currentUser._id,
          updates: { language },
        })
      );
      setIsEditingLanguage(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "تأكيد الحذف",
      "هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.",
      [
        {
          text: "إلغاء",
          style: "cancel",
        },
        {
          text: "حذف",
          style: "destructive",
          onPress: () => {
            if (currentUser && currentUser._id) {
              dispatch(deleteUser({ userId: currentUser._id })).then(() => {
                dispatch(signOut());
                router.push("/login");
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>الإعدادات</HeaderTitle>
        <BackButton onPress={handleBackPress}>
          <Image
            source={require("../../assets/icons/forword.png")}
            style={{ width: 24, height: 24 }}
          />
        </BackButton>
      </Header>

      <ScrollView>
        <ProfileContainer>
          <ProfileImage source={profileImage} />
          <ProfileText>{currentUser?.username}</ProfileText>
          <SubText>{currentUser?.email}</SubText>
          <SubText>يمكنك تغيير اسمك أو كلمة المرور على موقعنا.</SubText>
        </ProfileContainer>

        <SectionHeader>حسابي</SectionHeader>

        {/* Display Streak */}

        {/* البلد */}
        <OptionContainer>
          <OptionRow>
            <OptionText>البلد</OptionText>
            {!isEditingCountry && (
              <TouchableOpacity onPress={handleEditCountry}>
                <Ionicons name="create-outline" size={20} color="#4b7bec" />
              </TouchableOpacity>
            )}
          </OptionRow>
          {isEditingCountry ? (
            <>
              <InputField
                placeholder="أدخل البلد"
                value={country}
                onChangeText={(text) => setCountry(text)}
                isEditing={isEditingCountry}
              />
              <UpdateButton onPress={handleUpdateCountry}>
                <ButtonText>تحديث البلد</ButtonText>
              </UpdateButton>
            </>
          ) : (
            <OptionText style={{ marginTop: 5 }}>{country || "--"}</OptionText>
          )}
        </OptionContainer>

        {/* المدينة */}
        <OptionContainer>
          <OptionRow>
            <OptionText>المدينة</OptionText>
            {!isEditingCity && (
              <TouchableOpacity onPress={handleEditCity}>
                <Ionicons name="create-outline" size={20} color="#4b7bec" />
              </TouchableOpacity>
            )}
          </OptionRow>
          {isEditingCity ? (
            <>
              <InputField
                placeholder="أدخل المدينة"
                value={city}
                onChangeText={(text) => setCity(text)}
                isEditing={isEditingCity}
              />
              <UpdateButton onPress={handleUpdateCity}>
                <ButtonText>تحديث المدينة</ButtonText>
              </UpdateButton>
            </>
          ) : (
            <OptionText style={{ marginTop: 5 }}>{city || "--"}</OptionText>
          )}
        </OptionContainer>

        {/* أنا أتحدث */}
        <OptionContainer>
          <OptionRow>
            <OptionText>أنا أتحدث</OptionText>
            {!isEditingLanguage && (
              <TouchableOpacity onPress={handleEditLanguage}>
                <Ionicons name="create-outline" size={20} color="#4b7bec" />
              </TouchableOpacity>
            )}
          </OptionRow>
          {isEditingLanguage ? (
            <>
              <InputField
                placeholder="أدخل اللغة"
                value={language}
                onChangeText={(text) => setLanguage(text)}
                isEditing={isEditingLanguage}
              />
              <UpdateButton onPress={handleUpdateLanguage}>
                <ButtonText>تحديث اللغة</ButtonText>
              </UpdateButton>
            </>
          ) : (
            <OptionText style={{ marginTop: 5 }}>{language || "--"}</OptionText>
          )}
        </OptionContainer>
        <OptionContainer>
          <OptionRow>
            <OptionText>
              عدد أيام الحماس: {currentUser?.streak?.count ?? 0}
            </OptionText>
            <Image
              source={StreakIcon}
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
          </OptionRow>
        </OptionContainer>

        <SectionHeader>عام</SectionHeader>
        <TouchableOpacity onPress={handleToggleNotifications}>
          <OptionContainer>
            <OptionRow>
              <OptionText>الإشعارات</OptionText>
              <Ionicons name="notifications" size={20} color="#4b7bec" />
            </OptionRow>
          </OptionContainer>
        </TouchableOpacity>
        <OptionContainer>
          <OptionRow>
            <OptionText>لغة العرض</OptionText>
            <OptionText>{currentUser?.displayLanguage ?? "العربية"}</OptionText>
          </OptionRow>
        </OptionContainer>

        <DeleteButton onPress={handleDeleteAccount}>
          <ButtonText>حذف الحساب</ButtonText>
        </DeleteButton>
      </ScrollView>
      <Modal
        transparent={true}
        animationType="slide"
        visible={notificationModalVisible}
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <ModalContainer>
          <ModalContent>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              لتلقي التذكيرات والتحديثات، يرجى تفعيل الإشعارات.
            </Text>
            <ButtonGroup>
              <NotificationButton
                onPress={handleOptOutNotifications}
                style={{ backgroundColor: "#f0f0f0" }}
              >
                <ButtonText style={{ color: "#000" }}>ربما لاحقًا</ButtonText>
              </NotificationButton>
              <NotificationButton onPress={handleOptInNotifications}>
                <ButtonText>تفعيل الإشعارات</ButtonText>
              </NotificationButton>
            </ButtonGroup>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default SettingsPage;
