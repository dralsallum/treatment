import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { Linking } from "react-native";
import {
  TouchableOpacity,
  Modal,
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { signOut, userSelector } from "../../redux/authSlice";
import { xpSelector, fetchUnlockedSets } from "../../redux/lessonsSlice";
import axios from "axios";
import { Image as ExpoImage } from "expo-image";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";

/* Existing Styled Components */

const SafeArea = styled.SafeAreaView`
  background-color: #ffffff;
  direction: rtl;
  height: 47px;
`;

const NavbarContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 10px 10px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
  z-index: 1000;
`;

const NavItem = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
`;

const NavIcon = styled(ExpoImage)`
  width: 24px;
  height: 24px;
`;

const NavBadge = styled.Text`
  font-size: 12px;
  color: ${({ active }) => (active ? "#007AFF" : "#8e8e93")};
  margin-left: 4px;
`;

/* Existing Modal Styled Components */

const ModalContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  height: 60%;
  background-color: #ffffff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  elevation: 8;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

const CrossIcon = styled(ExpoImage)`
  width: 26px;
  height: 26px;
`;

const ProfileInfo = styled.View`
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
`;

const ProfileImage = styled(ExpoImage)`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-left: 20px;
`;

const ProfileTextContainer = styled.View`
  flex: 1;
  text-align: left;
`;

const ProfileText = styled.Text`
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  text-align: left;
`;

const StreakContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px; /* Adjusted for spacing */
`;

const StreakIcon = styled(ExpoImage)`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const StreakText = styled.Text`
  font-size: 16px;
  color: #333;
  text-align: left;
`;

const ProfileButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: #007aff;
  border-radius: 10px;
  align-items: center;
  margin-bottom: 10px;
`;

const ProfileButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
`;

const ProfileButtonsContainer = styled.View`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  padding: 0 20px;
`;

const ItemBox = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  elevation: 8;
  margin: 10px;
`;

const ItemImage = styled(ExpoImage)`
  width: 60px;
  height: 60px;
  margin-right: 10px;
  border-radius: 10px;
`;

const ItemTextContainer = styled.View`
  flex: 1;
  margin-left: 10px;
`;

const ItemTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: right;
`;

const ItemSubText = styled.Text`
  font-size: 14px;
  color: #777;
  text-align: right;
`;

/* Tooltip Modal Styled Components */

const TooltipModalContainer = styled.View`
  position: absolute;
  z-index: 1001;
  top: 100px;
  right: 100px;
`;

const TooltipModalContent = styled.View`
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 8px 12px;
  border-radius: 6px;
  width: 160px; /* Smaller width */
  align-items: center;
`;

const TooltipModalText = styled.Text`
  color: #000000;
  font-size: 12px;
  text-align: center;
`;

/* Navigation Items */

const NAV_ITEMS = [
  {
    id: "Notifications",
    icon: require("../../../assets/icons/notification.png"),
    label: "الإشعارات",
    showBadge: false,
  },
  {
    id: "Streak",
    icon: require("../../../assets/icons/fire.png"),
    label: "الحماس",
    showBadge: true,
  },
  {
    id: "XP",
    icon: require("../../../assets/icons/stars.png"),
    label: "النقاط",
    showBadge: true,
  },
  {
    id: "Me",
    icon: require("../../../assets/images/person.png"),
    label: "الملف الشخصي",
    showBadge: false,
  },
];

/* Navbar Component */

const Navbar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [tooltipModal, setTooltipModal] = useState({
    visible: false,
    message: "",
    x: 0,
    y: 0,
  });

  const dispatch = useDispatch();
  const xp = useSelector(xpSelector);
  const { currentUser } = useSelector(userSelector);
  const streakCount = currentUser?.streak?.count ?? 0;

  /* Fetch Notifications */
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "https://quizeng-022517ad949b.herokuapp.com/api/notifications"
      );
      return res.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    const getNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };

    getNotifications();
  }, []);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchUnlockedSets(currentUser._id));
    }
  }, [currentUser, dispatch]);

  /* Handle Modal Open */
  const handleOpenModal = (tabId, event) => {
    if (tabId === "Notifications") {
      setActiveTab(tabId);
      setNotificationsModalVisible(true);
    } else if (tabId === "Me") {
      setActiveTab(tabId);
      setProfileModalVisible(true);
    } else if (tabId === "XP" || tabId === "Streak") {
      const message =
        tabId === "XP"
          ? "Stars are awarded for finishing lessons."
          : "Streak counts the number of consecutive days you log in.";

      if (event) {
        const { pageX, pageY } = event.nativeEvent;
        setTooltipModal({
          visible: true,
          message,
          x: pageX,
          y: pageY,
        });

        // Automatically hide the tooltip after 3 seconds
        setTimeout(() => {
          setTooltipModal({ visible: false, message: "", x: 0, y: 0 });
        }, 3000);
      } else {
        // Fallback position if event is not available
        setTooltipModal({
          visible: true,
          message,
          x: 20,
          y: 100,
        });

        setTimeout(() => {
          setTooltipModal({ visible: false, message: "", x: 0, y: 0 });
        }, 3000);
      }
    }
  };

  /* Handle Modal Close */
  const handleCloseModal = () => {
    setNotificationsModalVisible(false);
    setProfileModalVisible(false);
    setActiveTab(null);
    setTooltipModal({ visible: false, message: "" });
  };

  /* Handle Sign Out */
  const handleSignOut = () => {
    dispatch(signOut());
    handleCloseModal();
    router.push("sign-in");
  };

  /* Handle Settings */
  const handleSetting = () => {
    handleCloseModal();
    router.push("setting");
  };

  const handleTerms = async () => {
    const url =
      "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

    try {
      const result = await WebBrowser.openBrowserAsync(url);
      // Optionally handle the result
    } catch (error) {
      console.error(`Failed to open URL: ${error}`);
    }

    // Close the modal after the browser interaction is done
    handleCloseModal();
  };

  return (
    <SafeArea>
      {/* Navbar */}
      <NavbarContainer>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            onPressIn={(event) => handleOpenModal(item.id, event)}
          >
            <NavIcon source={item.icon} cachePolicy="memory" />
            {item.showBadge && (
              <NavBadge active={activeTab === item.id}>
                {item.id === "XP" ? xp : item.id === "Streak" ? streakCount : 0}
              </NavBadge>
            )}
          </NavItem>
        ))}
      </NavbarContainer>

      {/* Tooltip Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={tooltipModal.visible}
        onRequestClose={() => setTooltipModal({ visible: false, message: "" })}
      >
        <TouchableWithoutFeedback
          onPress={() => setTooltipModal({ visible: false, message: "" })}
        >
          <TooltipModalContainer>
            <TouchableWithoutFeedback>
              <TooltipModalContent>
                <TooltipModalText>{tooltipModal.message}</TooltipModalText>
              </TooltipModalContent>
            </TouchableWithoutFeedback>
          </TooltipModalContainer>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={notificationsModalVisible}
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>

        <ModalContainer>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>الإشعارات</ModalTitle>
              <TouchableOpacity onPress={handleCloseModal}>
                <CrossIcon
                  source={require("../../../assets/icons/grayCross.png")}
                />
              </TouchableOpacity>
            </ModalHeader>
            <ScrollView>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <View key={notification._id}>
                    <ItemBox>
                      <ItemImage
                        source={{ uri: notification.image }}
                        placeholder={require("../../../assets/images/thumbnail.png")}
                      />
                      <ItemTextContainer>
                        <ItemTitle>{notification.title}</ItemTitle>
                        <ItemSubText>{notification.message}</ItemSubText>
                      </ItemTextContainer>
                    </ItemBox>
                  </View>
                ))
              ) : (
                <Text>لا توجد إشعارات</Text>
              )}
            </ScrollView>
          </ModalContent>
        </ModalContainer>
      </Modal>

      {/* Profile Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={profileModalVisible}
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <ModalContainer>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>الملف الشخصي</ModalTitle>
                <TouchableOpacity onPress={handleCloseModal}>
                  <CrossIcon
                    source={require("../../../assets/icons/grayCross.png")}
                  />
                </TouchableOpacity>
              </ModalHeader>

              <ProfileInfo>
                <ProfileTextContainer>
                  <ProfileText>
                    اسم المستخدم: {currentUser?.username}
                  </ProfileText>
                  <ProfileText>
                    البريد الإلكتروني: {currentUser?.email}
                  </ProfileText>
                  <StreakContainer>
                    <StreakIcon
                      source={require("../../../assets/icons/fire.png")}
                    />
                    <StreakText>عدد أيام الحماس: {streakCount}</StreakText>
                  </StreakContainer>
                </ProfileTextContainer>
                <ProfileImage
                  source={require("../../../assets/images/profile.png")}
                  placeholder={require("../../../assets/images/thumbnail.png")}
                />
              </ProfileInfo>

              <ProfileButtonsContainer>
                <ProfileButton onPress={handleSetting}>
                  <ProfileButtonText>الإعدادات</ProfileButtonText>
                </ProfileButton>
                <ProfileButton onPress={handleTerms}>
                  <ProfileButtonText>
                    الشروط والاحكام - terms of services
                  </ProfileButtonText>
                </ProfileButton>

                <ProfileButton onPress={handleSignOut}>
                  <ProfileButtonText>تسجيل الخروج</ProfileButtonText>
                </ProfileButton>
              </ProfileButtonsContainer>
            </ModalContent>
          </ModalContainer>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeArea>
  );
};

export default Navbar;
