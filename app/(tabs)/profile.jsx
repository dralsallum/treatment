import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components/native";
import {
  I18nManager,
  ScrollView,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  Share,
} from "react-native";
import { useSelector } from "react-redux";
import { userSelector } from "../redux/authSlice";
import { xpSelector } from "../redux/lessonsSlice";
import { selectScore } from "../redux/scoreSlice";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import { Audio } from "expo-av";
import { createUserRequest } from "../../requestMethods";

I18nManager.allowRTL(true);

/* Safe Area */
const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #f2f5f9;
`;

/* ScrollView */
const StyledScrollView = styled.ScrollView``;

/* Header */
const Header = styled.View`
  background-color: #ffffff;
  padding: 20px;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
`;

/* Profile Container */
const ProfileContainer = styled.View`
  flex-direction: row-reverse;
  align-items: center;
`;

/* Profile Image */
const ProfileImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #f2f5f9;
`;

/* User Name */
const UserName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-right: 10px;
`;

/* Icon Button */
const IconButton = styled.TouchableOpacity`
  background-color: #f2f5f9;
  padding: 10px;
  border-radius: 10px;
`;

/* Icon Image */
const IconImage = styled.Image`
  width: 20px;
  height: 20px;
`;

/* Section Header */
const SectionHeader = styled.View`
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

/* Section Title */
const SectionTitleText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

/* See More Button */
const SeeMoreButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

/* See More Button Text */
const SeeMoreButtonText = styled.Text`
  color: #4c47e9;
  font-size: 14px;
`;

/* See More Icon */
const SeeMoreIcon = styled.Image`
  width: 16px;
  height: 16px;
  tint-color: #4c47e9;
  margin-right: 5px;
`;

/* Upgrade Section */
const UpgradeContainer = styled.View`
  padding: 15px;
  background-color: #fff7e6;
  margin: 10px 20px;
  border-radius: 10px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

/* Upgrade Content */
const UpgradeContent = styled.View`
  flex-direction: row-reverse;
  align-items: center;
`;

/* Crown Icon */
const CrownIcon = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

/* Upgrade Text */
const UpgradeText = styled.Text`
  color: #333;
  font-size: 16px;
`;

/* Goals Section */
const GoalsContainer = styled.View`
  background-color: white;
  margin: 10px 20px;
  border-radius: 10px;
  padding: 15px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

/* Goals Header */
const GoalsHeader = styled(SectionHeader)``;

/* Goals Title */
const GoalsTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

/* Goals Toggle */
const GoalsToggle = styled.View`
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: 10px;
`;

/* Toggle Button */
const ToggleButton = styled.TouchableOpacity`
  flex: 1;
  padding: 12px 0;
  background-color: ${(props) => (props.active ? "#4c47e9" : "#f2f5f9")};
  border-radius: 20px;
  margin-left: ${(props) => (props.isFirst ? "0px" : "10px")};
`;

/* Toggle Text */
const ToggleText = styled.Text`
  color: ${(props) => (props.active ? "#fff" : "#333")};
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  text-align: center;
`;

/* Daily Progress */
const DailyProgress = styled.View`
  margin-top: 10px;
`;

/* Progress Row */
const ProgressRow = styled.View`
  flex-direction: row-reverse;
  justify-content: space-between;
  margin-bottom: 10px;
`;

/* Progress Text */
const ProgressText = styled.Text`
  font-size: 16px;
  color: #333;
`;

/* Progress Value */
const ProgressValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #4c47e9;
`;

/* Streak Section */
const StreakContainer = styled.View`
  background-color: #f7fbff;
  margin: 15px 20px;
  border-radius: 12px;
  padding: 20px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  elevation: 5;
`;

/* Streak Title */
const StreakTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #4c47e9;
  text-align: right;
`;

/* Streak Stats */
const StreakStats = styled.View`
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
`;

/* Streak Badge */
const StreakBadge = styled.View`
  align-items: center;
  justify-content: center;
`;

/* Progress Bar Container */
const ProgressBarContainer = styled.View`
  flex: 1;
  margin: 0 15px;
`;

/* Progress Bar Background */
const ProgressBarBackground = styled.View`
  width: 100%;
  height: 12px;
  background-color: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  flex-direction: row-reverse;
  margin-top: 10px;
`;

/* Progress Bar */
const ProgressBar = styled.View`
  width: ${(props) => props.progress}%;
  height: 100%;
  background-color: #4c47e9;
  align-self: flex-end;
`;

/* Current Streak */
const CurrentStreak = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #4c47e9;
  text-align: right;
  margin-bottom: 3px;
`;

/* Highest Streak */
const HighestStreak = styled.Text`
  font-size: 16px;
  color: #888;
  text-align: right;
`;

/* Invite Section */
const InviteContainer = styled.View`
  background-color: #e6f7ff;
  margin: 10px 20px;
  border-radius: 15px;
  padding: 20px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  elevation: 5;
`;

/* Invite Icon */
const InviteIcon = styled.Image`
  width: 60px;
  height: 60px;
  margin-bottom: 15px;
`;

/* Invite Text */
const InviteText = styled.Text`
  font-size: 18px;
  color: #333;
  text-align: center;
  margin-bottom: 15px;
  font-weight: 600;
`;

/* Invite Button */
const InviteButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #4c47e9;
  padding: 12px 25px;
  border-radius: 25px;
  shadow-color: #4c47e9;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  elevation: 3;
`;

/* Invite Button Icon */
const InviteButtonIcon = styled.Image`
  width: 20px;
  height: 20px;
  tint-color: #fff;
  margin-left: 10px;
`;

/* Invite Button Text */
const InviteButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

/* Modal Overlay */
const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
`;

/* Modal Container */
const ModalContainer = styled.View`
  width: 90%;
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 15px;
  padding: 25px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  elevation: 8;
`;

/* Modal Header */
const ModalHeader = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

/* Modal Title */
const ModalTitleStyled = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333333;
`;

/* Close Button */
const CloseButton = styled.TouchableOpacity`
  padding: 5px;
`;

/* Modal Content Wrapper */
const ModalContent = styled.View`
  width: 100%;
`;

/* Modal Buttons Container */
const ModalButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

/* Modal Button */
const ModalButton = styled.TouchableOpacity`
  flex: 1;
  padding: 12px 0;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.primary ? "#4c47e9" : "#cccccc")};
  margin: 0 5px;
`;

/* Button Text */
const ButtonTextStyled = styled.Text`
  color: ${(props) => (props.primary ? "#ffffff" : "#ffffff")};
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  background-color: transparent;
`;

/* Number Slider Components */
const NumberSliderContainer = styled.View`
  width: 100%;
  margin-bottom: 20px;
`;

/* Slider Label */
const SliderLabel = styled.Text`
  align-self: flex-start;
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
`;

/* Number List */
const NumberList = styled.FlatList``;

/* Define the width based on screen dimensions */
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = SCREEN_WIDTH * 0.2;

/* Number Item */
const NumberItem = styled.TouchableOpacity`
  width: ${ITEM_WIDTH}px;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-horizontal: 5px;
  border-radius: 5px;
  background-color: ${(props) => (props.selected ? "#4c47e9" : "#f2f5f9")};
`;

/* Number Text */
const NumberText = styled.Text`
  color: ${(props) => (props.selected ? "#fff" : "#333")};
  font-size: 16px;
  font-weight: ${(props) => (props.selected ? "600" : "400")};
`;

/* Badge Item */
const BadgeItem = styled.View`
  width: 30%;
  align-items: center;
  margin-bottom: 10px;
`;

/* Badge Icon */
const BadgeIconStyled = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background-color: #f2f5f9;
  margin-bottom: 5px;
`;

/* Badge Label */
const BadgeLabel = styled.Text`
  font-size: 14px;
  color: #333;
  text-align: center;
`;

/* Badges Container */
const BadgesContainer = styled.View`
  background-color: white;
  margin: 10px 20px;
  border-radius: 10px;
  padding: 15px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

/* Badges Grid */
const BadgesGrid = styled.View`
  flex-direction: row-reverse;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 10px;
`;

/* Styled Button for "تحديد الأهداف" */
const StyledButton = styled.View`
  background-color: #4c47e9;
  padding: 12px 25px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;

/* Button Text */
const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

/* Congratulatory Text */
const CongratulatoryText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 20px;
`;

/* Badge Image */
const BadgeImage = styled.Image`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;

/* Invite Modal Styled Components */
const InviteModalTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 20px;
`;

const InviteModalImage = styled.Image`
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
`;

const InviteModalInstruction = styled.Text`
  font-size: 16px;
  color: #333333;
  text-align: center;
  margin-bottom: 20px;
`;

const ShareSection = styled.View`
  width: 100%;
  border: 1px solid #4c47e9;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
`;

const ShareText = styled.Text`
  font-size: 16px;
  color: #333333;
  margin-bottom: 10px;
  text-align: center;
`;

/* Referral Link Container */
const ReferralLinkContainer = styled.View`
  background-color: #f2f5f9;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

/* Referral Link Text */
const ReferralLinkText = styled.Text`
  font-size: 14px;
  color: #333333;
  selectable: true;
`;

/* Send Button */
const SendButton = styled.TouchableOpacity`
  background-color: #4c47e9;
  padding: 10px 20px;
  border-radius: 5px;
  align-self: flex-end;
  width: 100%;
`;

/* Send Button Text */
const SendButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  text-align: center;
`;

/* Statistics Section */
const StatisticsSection = styled.View`
  width: 100%;
  align-items: flex-start;
`;

/* Invites Sent Text */
const InvitesSentText = styled.Text`
  font-size: 16px;
  color: #333333;
  margin-bottom: 5px;
`;

/* Invites Sent Number */
const InvitesSentNumber = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #4c47e9;
  opacity: 1;
`;

const EnvelopeIconsContainer = styled.View`
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

/* Envelope Icon */
const EnvelopeIcon = styled.Image`
  width: 40px;
  height: 40px;
  margin: 0 5px;
`;

/* Reusable NumberSlider Component */
const NumberSlider = ({ label, numbers, selectedValue, onSelect }) => {
  const flatListRef = useRef(null);

  const handleSelect = (num) => {
    onSelect(num);
    const index = numbers.indexOf(num);
    if (flatListRef.current && index !== -1) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
      });
    }
  };

  return (
    <NumberSliderContainer>
      <SliderLabel>{label}</SliderLabel>
      <NumberList
        ref={flatListRef}
        data={numbers}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <NumberItem
            selected={selectedValue === item}
            onPress={() => handleSelect(item)}
          >
            <NumberText selected={selectedValue === item}>{item}</NumberText>
          </NumberItem>
        )}
        contentContainerStyle={{
          flexDirection: "row",
          justifyContent: "flex-start",
          paddingLeft: 10,
        }}
        snapToInterval={ITEM_WIDTH + 10}
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH + 10,
          offset: (ITEM_WIDTH + 10) * index,
          index,
        })}
        inverted={I18nManager.isRTL ? true : false}
        style={{
          transform: I18nManager.isRTL ? [{ scaleX: -1 }] : [],
        }}
        renderToHardwareTextureAndroid
      />
    </NumberSliderContainer>
  );
};

/* Reusable Badge Item Component */
const BadgeItemComponent = ({ icon, label, isUnlocked }) => (
  <BadgeItem>
    <BadgeIconStyled source={icon} style={{ opacity: isUnlocked ? 1 : 0.3 }} />
    <BadgeLabel>{label}</BadgeLabel>
  </BadgeItem>
);

/* Profile Component */
const Profile = () => {
  const { currentUser } = useSelector(userSelector);
  const isPaid = currentUser?.isPaid;
  const xp = useSelector(xpSelector);
  const score = useSelector(selectScore);
  const router = useRouter();
  const streakCount = currentUser?.streak?.count ?? 0;
  const highestStreak = currentUser?.streak?.highest ?? 0;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChapters, setSelectedChapters] = useState(1);
  const [selectedTrainingDays, setSelectedTrainingDays] = useState(1);
  const [isDaily, setIsDaily] = useState(true);
  const [newBadgeEarned, setNewBadgeEarned] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState(null);
  const [sound, setSound] = useState();
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [invitesAccepted, setInvitesAccepted] = useState(0);
  const [referralLink, setReferralLink] = useState("");

  // Badge Detection
  useEffect(() => {
    if (earnedBadges !== null && xp !== null) {
      const newlyEarnedBadges = badges.filter(
        (badge) => xp >= badge.requiredXp && !earnedBadges.includes(badge.label)
      );

      if (newlyEarnedBadges.length > 0 && !newBadgeEarned) {
        const latestBadge = newlyEarnedBadges[0];
        setNewBadgeEarned(latestBadge);
        updateBadgeInBackend(latestBadge.label);
        setEarnedBadges((prevBadges) => [...prevBadges, latestBadge.label]);
      }
    }
  }, [xp]);

  const closeBadgeModal = () => {
    setNewBadgeEarned(null);
  };

  const updateBadgeInBackend = async (badgeLabel) => {
    try {
      const userRequest = createUserRequest();
      const response = await userRequest.post(
        `/users/${currentUser._id}/badges`,
        { badge: badgeLabel }
      );
      if (response.status === 200) {
        console.log("Badge updated in backend");
      } else {
        console.error(
          "Failed to update badge in backend:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error updating badge in backend:", error);
    }
  };

  useEffect(() => {
    if (newBadgeEarned) {
      playSound();
    }
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [newBadgeEarned]);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync({
      uri: "https://alsallum.s3.eu-north-1.amazonaws.com/congragulation.mp3",
    });
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    if (currentUser) {
      fetchEarnedBadges();
    }
  }, [currentUser]);

  const fetchEarnedBadges = async () => {
    try {
      const userRequest = createUserRequest();
      const response = await userRequest.get(
        `/users/${currentUser._id}/badges`
      );
      if (response.status === 200) {
        setEarnedBadges(response.data.badges || []);
      } else {
        console.error("Failed to fetch badges:", response.data.message);
        setEarnedBadges([]);
      }
    } catch (error) {
      console.error("Error fetching badges:", error);
      setEarnedBadges([]);
    }
  };

  // Invite Function
  const handleInvite = async () => {
    try {
      const result = await Share.share({
        message:
          "انضم إلى تطبيقنا الرائع واستمتع بتجربة مميزة! حمل التطبيق الآن من هنا: " +
          referralLink,
        url: referralLink,
        title: "دعوة للانضمام إلى تطبيقنا",
      });

      if (result.action === Share.sharedAction) {
        console.log("Invite link shared successfully!");
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dialog dismissed");
      }
    } catch (error) {
      alert("حدث خطأ أثناء محاولة المشاركة: " + error.message);
    }
  };

  useEffect(() => {
    if (inviteModalVisible && currentUser) {
      fetchInvitesAccepted();
    }
  }, [inviteModalVisible, currentUser]);

  const fetchInvitesAccepted = async () => {
    try {
      const userRequest = createUserRequest();
      const response = await userRequest.get(
        `/users/${currentUser._id}/invitesAccepted`
      );
      if (response.status === 200) {
        setInvitesAccepted(response.data.invitesAccepted);
      } else {
        console.error(
          "Failed to fetch invites accepted:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error fetching invites accepted:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      console.log("Current User:", currentUser);
      const link = `https://apps.apple.com/sa/app/fluentfox-language-lessons/id6673901781?referralCode=${currentUser.referralCode}`;
      setReferralLink(link);
    }
  }, [currentUser]);

  // Handle functions
  const handleSeeMore = (section) => {
    router.push("subscription");
  };

  const handleSetting = (section) => {
    router.push("setting");
  };

  const handleSaveGoals = () => {
    console.log(
      `Chapters: ${selectedChapters}, Training Days: ${selectedTrainingDays}`
    );
    setModalVisible(false);
  };

  // Define Badges with XP Requirements
  const badges = [
    {
      icon: require("../../assets/icons/axe.png"),
      label: "مستمع شغوف",
      requiredXp: 5,
    },
    {
      icon: require("../../assets/icons/badge.png"),
      label: "متعلم ماهر",
      requiredXp: 10,
    },
    {
      icon: require("../../assets/icons/reputation.png"),
      label: "متعلم ممتاز",
      requiredXp: 15,
    },
  ];

  return (
    <SafeArea>
      {/* Scrollable Content */}
      <StyledScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header>
          <ProfileContainer>
            <ProfileImage source={require("../../assets/images/profile.png")} />
            <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
              <UserName>{currentUser ? currentUser.username : "ضيف"}</UserName>
            </View>
          </ProfileContainer>
          <IconButton onPress={handleSetting}>
            <IconImage source={require("../../assets/icons/settings.png")} />
          </IconButton>
        </Header>

        {/* Upgrade Section */}
        {!isPaid && (
          <UpgradeContainer>
            <SectionHeader>
              <SectionTitleText>الترقية</SectionTitleText>
              <SeeMoreButton onPress={() => handleSeeMore("Upgrade")}>
                <SeeMoreIcon source={require("../../assets/icons/back.png")} />
                <SeeMoreButtonText>عرض المزيد</SeeMoreButtonText>
              </SeeMoreButton>
            </SectionHeader>
            <UpgradeContent>
              <CrownIcon source={require("../../assets/images/crown.png")} />
              <UpgradeText>الترقية إلى النسخة المميزة</UpgradeText>
            </UpgradeContent>
          </UpgradeContainer>
        )}
        {/* Goals Section */}
        <GoalsContainer>
          <GoalsHeader>
            <GoalsTitle>الهدف اليومي</GoalsTitle>
          </GoalsHeader>
          <GoalsToggle>
            <ToggleButton
              active={isDaily}
              onPress={() => setIsDaily(true)}
              isFirst
            >
              <ToggleText active={isDaily}>يومي</ToggleText>
            </ToggleButton>
            <ToggleButton active={!isDaily} onPress={() => setIsDaily(false)}>
              <ToggleText active={!isDaily}>أسبوعي</ToggleText>
            </ToggleButton>
          </GoalsToggle>
          <DailyProgress>
            {isDaily ? (
              <>
                <ProgressRow>
                  <ProgressText>فصول</ProgressText>
                  <ProgressValue>
                    {selectedChapters}/{xp}
                  </ProgressValue>
                </ProgressRow>
                <ProgressRow>
                  <ProgressText>تدريبات</ProgressText>
                  <ProgressValue>
                    {selectedTrainingDays}/{score}
                  </ProgressValue>
                </ProgressRow>
              </>
            ) : (
              <>
                <ProgressRow>
                  <ProgressText>فصول مكتملة</ProgressText>
                  <ProgressValue>30/{xp}</ProgressValue>
                </ProgressRow>
                <ProgressRow>
                  <ProgressText>تدريبات مكتملة</ProgressText>
                  <ProgressValue>30/{score}</ProgressValue>
                </ProgressRow>
              </>
            )}
          </DailyProgress>
          {/* New Button to Open Modal */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ marginTop: 20, alignSelf: "center" }}
          >
            <StyledButton>
              <ButtonText>تحديد الأهداف</ButtonText>
            </StyledButton>
          </TouchableOpacity>
        </GoalsContainer>

        {/* Streak Section */}
        <StreakContainer>
          <SectionHeader>
            <StreakTitle>احصاءات</StreakTitle>
          </SectionHeader>
          <StreakStats>
            <StreakBadge>
              <BadgeIconStyled
                source={require("../../assets/icons/purpleFire.png")}
              />
              <BadgeLabel>{streakCount} أيام</BadgeLabel>
            </StreakBadge>
            <ProgressBarContainer>
              <CurrentStreak>ايام الحماس: {streakCount}</CurrentStreak>
              <HighestStreak>أعلى حماسة: {highestStreak}</HighestStreak>
              <ProgressBarBackground>
                <ProgressBar progress={(streakCount / 30) * 100} />
              </ProgressBarBackground>
            </ProgressBarContainer>
          </StreakStats>
        </StreakContainer>

        {/* Badges Section */}
        <BadgesContainer>
          <SectionHeader>
            <SectionTitleText>شارات</SectionTitleText>
          </SectionHeader>
          <BadgesGrid>
            {badges.map((badge, index) => {
              // Determine if badge is unlocked
              const isUnlocked =
                Array.isArray(earnedBadges) &&
                earnedBadges.includes(badge.label);

              return (
                <BadgeItemComponent
                  key={index}
                  icon={badge.icon}
                  label={badge.label}
                  isUnlocked={isUnlocked}
                />
              );
            })}
          </BadgesGrid>
        </BadgesContainer>

        {/* Invite Section */}
        <InviteContainer>
          <InviteIcon source={require("../../assets/icons/invite.png")} />
          <InviteText>ادعُ أصدقاءك واحصل على مكافآت مجانية</InviteText>
          <InviteButton
            onPress={() => setInviteModalVisible(true)}
            activeOpacity={0.7}
          >
            <InviteButtonText>ادعُ أصدقاءك</InviteButtonText>
            <InviteButtonIcon
              source={require("../../assets/icons/share.png")}
            />
          </InviteButton>
        </InviteContainer>
      </StyledScrollView>

      {/* Goals Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalOverlay>
          <ModalContainer>
            {/* Modal Header with Close Button */}
            <ModalHeader>
              <ModalTitleStyled>تحديد الأهداف</ModalTitleStyled>
              <CloseButton onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={24} color="#333333" />
              </CloseButton>
            </ModalHeader>

            {/* Modal Content */}
            <ModalContent>
              {/* Chapters Number Slider */}
              <NumberSlider
                label="عدد الفصول:"
                numbers={[1, 2, 3, 4, 5, 6, 7, 8]}
                selectedValue={selectedChapters}
                onSelect={setSelectedChapters}
              />

              {/* Training Days Number Slider */}
              <NumberSlider
                label="أيام التدريب:"
                numbers={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                selectedValue={selectedTrainingDays}
                onSelect={setSelectedTrainingDays}
              />
            </ModalContent>

            {/* Modal Buttons */}
            <ModalButtons>
              <ModalButton onPress={() => setModalVisible(false)}>
                <ButtonTextStyled>إلغاء</ButtonTextStyled>
              </ModalButton>
              <ModalButton primary onPress={handleSaveGoals}>
                <ButtonTextStyled primary>حفظ</ButtonTextStyled>
              </ModalButton>
            </ModalButtons>
          </ModalContainer>
        </ModalOverlay>
      </Modal>

      {/* Invite Friends Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={inviteModalVisible}
        onRequestClose={() => setInviteModalVisible(false)}
      >
        <ModalOverlay>
          <ModalContainer>
            {/* Close Button */}
            <CloseButton onPress={() => setInviteModalVisible(false)}>
              <AntDesign name="close" size={24} color="#333333" />
            </CloseButton>
            {/* Header Section */}
            <InviteModalImage
              source={require("../../assets/icons/reputation.png")}
            />
            <InviteModalTitle>شارك اصدقائك التعليم!</InviteModalTitle>
            {/* Instruction Section */}
            <InviteModalInstruction>
              احصل على بادج اذا دعوت ٥ اصدقاء
            </InviteModalInstruction>
            {/* Share Section */}
            <ShareSection>
              <ShareText>شارك هذا الرابط:</ShareText>
              <ReferralLinkContainer>
                <ReferralLinkText selectable={true}>
                  {referralLink}
                </ReferralLinkText>
              </ReferralLinkContainer>
              <SendButton onPress={handleInvite}>
                <SendButtonText>إرسال</SendButtonText>
              </SendButton>
            </ShareSection>
            <EnvelopeIconsContainer>
              {[...Array(5)].map((_, index) => (
                <EnvelopeIcon
                  key={index}
                  source={require("../../assets/icons/referral.png")}
                  style={{ opacity: index < invitesAccepted ? 1 : 0.4 }}
                />
              ))}
            </EnvelopeIconsContainer>
            {/* Statistics Section */}
            <StatisticsSection>
              <InvitesSentText>عدد الدعوات المقبولة:</InvitesSentText>
              <InvitesSentNumber>{invitesAccepted}</InvitesSentNumber>
            </StatisticsSection>
          </ModalContainer>
        </ModalOverlay>
      </Modal>

      {/* New Badge Earned Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={!!newBadgeEarned}
        onRequestClose={closeBadgeModal}
      >
        <ModalOverlay>
          <ModalContainer>
            {/* Confetti Animation */}
            {newBadgeEarned && (
              <ConfettiCannon
                count={200}
                origin={{ x: -10, y: 0 }}
                fadeOut={true}
              />
            )}
            {/* Congratulatory Message */}
            <CongratulatoryText>تهانينا! 🎉</CongratulatoryText>
            {/* Badge Image */}
            {newBadgeEarned && <BadgeImage source={newBadgeEarned.icon} />}
            {/* Badge Label */}
            {newBadgeEarned && <BadgeLabel>{newBadgeEarned.label}</BadgeLabel>}
            {/* Close Button */}
            <ModalButton primary onPress={closeBadgeModal}>
              <ButtonTextStyled primary>إغلاق</ButtonTextStyled>
            </ModalButton>
          </ModalContainer>
        </ModalOverlay>
      </Modal>
    </SafeArea>
  );
};

export default Profile;
