// sign-in.js
import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { login, userSelector } from "../redux/authSlice";
import withAuthRedirect from "../redux/withAuthRedirect";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Predefined colors for accounts
const ACCOUNT_COLORS = [
  "#4c47e8",
  "#6BCB77",
  "#FF6B6B",
  "#FFD93D",
  "#845EC2",
  "#FF9671",
];

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #f0f4f7;
`;

const Form = styled.View`
  flex: 1;
  justify-content: center;
  padding: 30px 20px;
`;

const Header = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
`;

const AccountContainer = styled(Animated.View)`
  width: 100%;
  background-color: ${(props) => props.bgColor || "#ffffff"};
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const AccountTouchable = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const AccountInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Avatar = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: rgba(255, 255, 255, 0.3);
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;

const AvatarIcon = styled(Ionicons)`
  color: #ffffff;
  font-size: 28px;
`;

const AccountName = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
`;

const ChevronIcon = styled(Ionicons)`
  color: #ffffff;
  font-size: 24px;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  margin-top: 20px;
  padding: 0 15px;
  background-color: #ffffff;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
`;

const InputIcon = styled(Ionicons)`
  margin-right: 10px;
  color: #888;
`;

const Input = styled.TextInput`
  flex: 1;
  height: 50px;
  font-size: 16px;
  color: #333;
`;

const Button = styled.TouchableOpacity`
  background-color: #ffffff;
  border: 2px solid #ffffff;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  height: 55px;
  margin-top: 25px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
  elevation: 3;
  background-color: ${(props) => props.bgColor || "#4c47e8"};
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;

const SecondaryButton = styled.TouchableOpacity`
  margin-top: 20px;
  align-items: center;
`;

const SecondaryButtonText = styled.Text`
  color: #4c47e8;
  font-size: 16px;
  font-weight: 500;
`;

const ForgotPasswordButton = styled.TouchableOpacity`
  margin-top: 15px;
  align-items: center;
`;

const ForgotPasswordTextOld = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: 600;
`;
const ForgotPasswordTextNew = styled.Text`
  color: #4c47e8;
  font-size: 15px;
  font-weight: 600;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
`;

const TermsText = styled.Text`
  text-align: center;
  color: #aaa;
  font-size: 14px;
  line-height: 22px;
  margin-top: 25px;
`;

const TermsLink = styled.Text`
  color: #4c47e8;
  font-weight: 500;
  text-decoration: underline;
  text-align: center;
`;

const AddAccountCard = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #d1e7dd;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  border: 2px dashed #0f5132;
`;

const AddAccountText = styled.Text`
  color: #0f5132;
  font-size: 18px;
  font-weight: 600;
`;

// Helper function to get color based on index
const getAccountColor = (index) => {
  return ACCOUNT_COLORS[index % ACCOUNT_COLORS.length];
};

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [passwords, setPasswords] = useState({});
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [expandedAccountIndex, setExpandedAccountIndex] = useState(null);
  const [animationValues, setAnimationValues] = useState([]);
  const dispatch = useDispatch();
  const { isError, isFetching, errorMessage } = useSelector(userSelector);
  const router = useRouter();

  // Utility function to capitalize the first letter
  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const accounts = await AsyncStorage.getItem("savedAccounts");
        if (accounts !== null) {
          const parsedAccounts = JSON.parse(accounts).map((account, idx) => ({
            ...account,
            username: capitalizeFirstLetter(account.username), // Ensure capitalization
            color: getAccountColor(idx),
          }));
          setSavedAccounts(parsedAccounts);
          setAnimationValues(parsedAccounts.map(() => new Animated.Value(0)));
        } else {
          setShowLoginForm(true);
        }
      } catch (error) {
        console.error("Error loading accounts", error);
        setShowLoginForm(true);
      }
    };
    loadAccounts();
  }, []);

  const handleLogin = async () => {
    try {
      const password =
        expandedAccountIndex !== null
          ? passwords[expandedAccountIndex]
          : passwords[0];
      const currentUsername =
        expandedAccountIndex !== null
          ? savedAccounts[expandedAccountIndex].username
          : username;

      const credentials = { username: currentUsername, password };
      const resultAction = await dispatch(login(credentials));

      if (login.fulfilled.match(resultAction)) {
        const userData = resultAction.payload;
        const newAccount = {
          username: capitalizeFirstLetter(userData.username), // Ensure capitalization
          color: getAccountColor(savedAccounts.length),
        };

        const accountExists = savedAccounts.some(
          (account) => account.username === newAccount.username
        );

        if (!accountExists) {
          const updatedAccounts = [...savedAccounts, newAccount];
          setSavedAccounts(updatedAccounts);
          await AsyncStorage.setItem(
            "savedAccounts",
            JSON.stringify(updatedAccounts)
          );
        }

        setPasswords({});
        setExpandedAccountIndex(null);

        if (expandedAccountIndex !== null) {
          Animated.timing(animationValues[expandedAccountIndex], {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
            easing: Easing.ease,
          }).start(() => setExpandedAccountIndex(null));
        }

        router.push("/home");
      } else {
        Alert.alert("فشل تسجيل الدخول", resultAction.payload);
      }
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  const handleAccountPress = (accountIndex) => {
    if (expandedAccountIndex === accountIndex) {
      Animated.timing(animationValues[accountIndex], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.ease,
      }).start(() => setExpandedAccountIndex(null));
    } else {
      if (expandedAccountIndex !== null) {
        Animated.timing(animationValues[expandedAccountIndex], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.ease,
        }).start();
      }
      Animated.timing(animationValues[accountIndex], {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.ease,
      }).start();
      setExpandedAccountIndex(accountIndex);
    }
  };

  const handlePasswordChange = (text, index) => {
    setPasswords({ ...passwords, [index]: text });
  };

  const handleOnboardingNavigation = () => {
    router.push("onboarding");
  };

  const handleForgotPassword = () => {
    router.push("response");
  };

  const handleAddAccount = () => {
    setShowLoginForm(true);
    setUsername("");
    setPasswords({});
    setExpandedAccountIndex(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
          <Form>
            <Header>
              {savedAccounts.length > 0 && !showLoginForm
                ? "مرحباً بعودتك!"
                : "تسجيل الدخول"}
            </Header>
            {isError && <ErrorText>{errorMessage}</ErrorText>}
            {savedAccounts.length > 0 && !showLoginForm ? (
              <>
                {savedAccounts.map((account, index) => {
                  if (
                    expandedAccountIndex !== null &&
                    expandedAccountIndex !== index
                  ) {
                    return null;
                  }

                  const isExpanded = expandedAccountIndex === index;
                  const animatedHeight = animationValues[index]?.interpolate({
                    inputRange: [0, 1],
                    outputRange: [80, 300],
                  });

                  return (
                    <AccountContainer
                      key={index}
                      style={{ height: animatedHeight }}
                      bgColor={account.color}
                    >
                      <AccountTouchable
                        onPress={() => handleAccountPress(index)}
                        activeOpacity={0.8}
                      >
                        <AccountInfo>
                          <Avatar>
                            <AvatarIcon name="person-outline" />
                          </Avatar>
                          <AccountName>{account.username}</AccountName>
                        </AccountInfo>
                        <ChevronIcon
                          name={
                            isExpanded
                              ? "chevron-up-outline"
                              : "chevron-down-outline"
                          }
                        />
                      </AccountTouchable>
                      {isExpanded && (
                        <>
                          <InputContainer>
                            <InputIcon
                              name="lock-closed-outline"
                              size={20}
                              color="#888"
                            />
                            <Input
                              secureTextEntry
                              placeholder="كلمة المرور"
                              placeholderTextColor="#888"
                              value={passwords[index] || ""}
                              onChangeText={(text) =>
                                handlePasswordChange(text, index)
                              }
                            />
                          </InputContainer>
                          <Button
                            onPress={handleLogin}
                            disabled={isFetching || !passwords[index]}
                            bgColor={account.color}
                          >
                            {isFetching ? (
                              <ActivityIndicator size="small" color="#fff" />
                            ) : (
                              <ButtonText>تسجيل الدخول</ButtonText>
                            )}
                          </Button>
                          <ForgotPasswordButton onPress={handleForgotPassword}>
                            <ForgotPasswordTextOld>
                              نسيت كلمة المرور؟
                            </ForgotPasswordTextOld>
                          </ForgotPasswordButton>
                        </>
                      )}
                    </AccountContainer>
                  );
                })}

                {/* Add New Account Card */}
                <AddAccountCard onPress={handleAddAccount}>
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color="#0f5132"
                  />
                  <AddAccountText>إضافة حساب جديد</AddAccountText>
                </AddAccountCard>

                {/* Terms of Service */}
                <TouchableOpacity
                  onPress={() =>
                    WebBrowser.openBrowserAsync(
                      "https://www.fluentfox.net/privacy-policy"
                    )
                  }
                >
                  <TermsLink>
                    يُرجى الاطلاع على إشعارات الخصوصية الخاصة بنا
                  </TermsLink>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <InputContainer>
                  <InputIcon name="person-outline" size={20} />
                  <Input
                    placeholder="اسم المستخدم"
                    placeholderTextColor="#888"
                    value={username}
                    onChangeText={(text) =>
                      setUsername(capitalizeFirstLetter(text))
                    }
                    autoCapitalize="none"
                  />
                </InputContainer>
                <InputContainer>
                  <InputIcon name="lock-closed-outline" size={20} />
                  <Input
                    secureTextEntry
                    placeholder="كلمة المرور"
                    placeholderTextColor="#888"
                    value={passwords[0] || ""}
                    onChangeText={(text) => setPasswords({ 0: text })}
                  />
                </InputContainer>
                <Button
                  onPress={handleLogin}
                  disabled={isFetching || !username || !passwords[0]}
                >
                  {isFetching ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <ButtonText>تسجيل الدخول</ButtonText>
                  )}
                </Button>
                <ForgotPasswordButton onPress={handleForgotPassword}>
                  <ForgotPasswordTextNew>
                    نسيت كلمة المرور؟
                  </ForgotPasswordTextNew>
                </ForgotPasswordButton>
                <SecondaryButton
                  onPress={() => {
                    setUsername("");
                    setPasswords({});
                    setShowLoginForm(false);
                  }}
                >
                  <SecondaryButtonText>
                    العودة إلى الحسابات المحفوظة
                  </SecondaryButtonText>
                </SecondaryButton>
                <SecondaryButton onPress={handleOnboardingNavigation}>
                  <SecondaryButtonText>
                    ليس لديك حساب؟ أنشئ حسابًا جديدًا
                  </SecondaryButtonText>
                </SecondaryButton>
              </>
            )}
          </Form>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withAuthRedirect(SignIn);
