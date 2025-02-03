// onboarding.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { register, clearState } from "../redux/authSlice";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotification } from "../redux/NotificationContext";

export const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: 30px;
`;

const BackButton = styled.TouchableOpacity``;

const ProgressBarContainer = styled.View`
  flex: 1;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-left: 4px;
`;

const ProgressBar = styled.View`
  height: 100%;
  background-color: #4caf50;
  width: ${({ progress }) => `${progress}%`};
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
`;

const Subtitle = styled.Text`
  font-size: 18px;
  text-align: center;
  color: #666;
  margin-bottom: 20px;
`;

const OptionsContainer = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  elevation: 4;
`;

const Option = styled.TouchableOpacity`
  flex-direction: row-reverse;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: ${({ selected }) => (selected ? "#E3F2FD" : "#F9F9F9")};
  border: 1px solid ${({ selected }) => (selected ? "#2196F3" : "#ccc")};
`;

const OptionIcon = styled.Image`
  width: 24px;
  height: 24px;
  margin-left: 20px;
`;

const OptionText = styled.Text`
  font-size: 18px;
  color: #333;
  flex: 1;
  text-align: right;
`;

const GoalImage = styled.Image`
  width: 100%;
  height: 100px;
  margin-bottom: 20px;
  resize-mode: contain;
`;

const ContinueButton = styled.TouchableOpacity`
  background-color: #2196f3;
  padding: 15px;
  border-radius: 10px;
  align-items: center;
  margin-top: 20px;
  opacity: ${({ enabled }) => (enabled ? 1 : 0.5)};
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 0 10px;
  background-color: #f9f9f9;
`;

const Input = styled.TextInput`
  flex: 1;
  height: 40px;
  margin-left: 10px;
  font-size: 16px;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
  text-align: center;
`;

const Form = styled.View`
  width: 100%;
  margin-top: 20px;
`;

const NotificationContainer = styled.View`
  align-items: center;
  margin-top: 20px;
`;

const ButtonGroup = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

const NotificationButton = styled(ContinueButton)`
  flex: 1;
  margin-horizontal: 5px;
`;

const CheckBoxContainer = styled.TouchableOpacity`
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: 15px;
`;

const CheckBox = styled.View`
  width: 18px;
  height: 18px;
  border-width: 1px;
  border-color: #ccc;
  background-color: ${({ checked }) => (checked ? "#2196f3" : "#fff")};
  margin-left: 10px;
  justify-content: center;
  align-items: center;
`;

const CheckBoxText = styled.Text`
  text-align: right;
  font-size: 12px;
  color: #333;
`;

// Updated Onboarding Questions with Notification Prompt Before Sign-Up
const questions = [
  {
    question: "حدد هدفك اليومي للدراسة",
    subText:
      "اختر المدة الزمنية التي يمكنك تخصيصها يوميًا لتعلم اللغة الإنجليزية.",
    options: [
      { text: "5 دقائق/يوم", icon: require("../../assets/icons/clock.png") },
      { text: "10 دقائق/يوم", icon: require("../../assets/icons/clock.png") },
      { text: "15 دقيقة/يوم", icon: require("../../assets/icons/clock.png") },
      { text: "20 دقيقة/يوم", icon: require("../../assets/icons/clock.png") },
    ],
    image: require("../../assets/images/goal.png"),
  },
  {
    question: "لماذا تتعلم اللغة الإنجليزية؟",
    subText: "اختر السبب الذي يصف دافعك بشكل أفضل.",
    options: [
      {
        text: "العائلة والمجتمع",
        icon: require("../../assets/icons/family.png"),
      },
      {
        text: "تحدي نفسي",
        icon: require("../../assets/icons/challenge.png"),
      },
      { text: "الثقافة", icon: require("../../assets/icons/education.png") },
      { text: "السفر", icon: require("../../assets/icons/travel.png") },
      { text: "العمل", icon: require("../../assets/icons/working.png") },
      { text: "المدرسة", icon: require("../../assets/icons/school.png") },
      { text: "أخرى", icon: require("../../assets/icons/other.png") },
    ],
  },
  {
    question: "مرحبًا، كم تعرف من اللغة الإنجليزية؟",
    subText: "حدد مستوى إتقانك الحالي للغة الإنجليزية.",
    options: [
      { text: "أنا مبتدئ", icon: require("../../assets/icons/beginner.png") },
      {
        text: "لدي بعض المعرفة بالإنجليزي، أريد تحديد مستواي بالبداية!",
        icon: require("../../assets/icons/expert.png"),
      },
    ],
    image: require("../../assets/images/goal.png"),
  },
  // Moved Notification Prompt Before Sign-Up
  {
    question: "ابقَ على المسار مع التذكيرات اليومية",
    subText: "التذكيرات تساعد في بناء عادات تعلم أفضل",
    options: [], // No options, this is a notification prompt
    isNotificationPrompt: true, // Custom flag to detect notification prompt
  },
  {
    question: "إنشاء حساب جديد",
    subText: "قم بتعبئة التفاصيل الخاصة بك لإنشاء حساب.",
    options: [], // No options for signup form
    isSignUp: true, // Custom flag to detect signup step
  },
];

const Onboarding = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [needTestFirst, setNeedTestFirst] = useState(false);
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    mailchimpOptIn: true,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { isFetching, isError, errorMessage, isSuccess } = useSelector(
    (state) => state.user
  );

  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  // Use the useNotification hook to get expoPushToken
  const { notification, expoPushToken, error } = useNotification();

  // Handle potential errors from the notification hook
  useEffect(() => {
    if (error) {
      console.error("Notification Error:", error);
      // Optionally, you can set an error state or notify the user
    }
  }, [error]);

  const progress = (currentQuestionIndex / (questions.length - 1)) * 100;

  const handleSelectOption = (index) => {
    setSelectedOptionIndex(index);
  };

  const handleInputChange = (name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = async () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.isNotificationPrompt) {
      await requestNotifications();
      // Proceed to the next step (sign-up)
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentQuestion.isSignUp) {
      if (!termsAccepted) {
        Alert.alert("التحقق مطلوب", "يجب قبول الشروط والأحكام للمتابعة.");
        return;
      }
      if (!inputs.username || !inputs.email || !inputs.password) {
        Alert.alert("حقول ناقصة", "يرجى ملء جميع الحقول المطلوبة.");
        return;
      }

      // Include expoPushToken in the registration data
      const registrationData = {
        ...inputs,
        expoPushToken: expoPushToken || null, // Handle cases where token might not be available
      };

      // Dispatch the register action
      const resultAction = await dispatch(register(registrationData));

      if (register.fulfilled.match(resultAction)) {
        // Save the username to AsyncStorage
        try {
          const storedAccounts = await AsyncStorage.getItem("savedAccounts");
          let parsedAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];

          // Capitalize the first letter of the username
          const capitalizeFirstLetter = (text) => {
            if (!text) return "";
            return text.charAt(0).toUpperCase() + text.slice(1);
          };
          const newUsername = capitalizeFirstLetter(inputs.username);

          // Check if the username already exists
          const accountExists = parsedAccounts.some(
            (account) => account.username === newUsername
          );

          if (!accountExists) {
            const updatedAccounts = [
              ...parsedAccounts,
              { username: newUsername },
            ];
            await AsyncStorage.setItem(
              "savedAccounts",
              JSON.stringify(updatedAccounts)
            );
          }
        } catch (error) {
          console.error("Error saving account to AsyncStorage:", error);
          Alert.alert(
            "خطأ",
            "حدث خطأ أثناء حفظ الحساب. يرجى المحاولة مرة أخرى."
          );
          return;
        }

        // Navigate based on needTestFirst
        if (needTestFirst) {
          router.push("test");
        } else {
          router.push("home");
        }
        dispatch(clearState());
      } else {
        // Handle registration failure
        Alert.alert("فشل التسجيل", resultAction.payload || "حدث خطأ.");
      }
    } else if (selectedOptionIndex !== null) {
      // Check if the current question is "مرحبًا، كم تعرف من اللغة الإنجليزية؟"
      if (currentQuestion.question === "مرحبًا، كم تعرف من اللغة الإنجليزية؟") {
        const selectedOption = currentQuestion.options[selectedOptionIndex];
        if (
          selectedOption.text ===
          "لدي بعض المعرفة بالإنجليزي، أريد تحديد مستواي بالبداية!"
        ) {
          setNeedTestFirst(true);
        } else {
          setNeedTestFirst(false); // Ensure it's false if another option is selected
        }
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOptionIndex(null);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex === 0) {
      router.back();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOptionIndex(null);
    }
  };

  const requestNotifications = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "إذن الإشعارات",
          "إذن الإشعارات غير ممنوح. يمكنك تفعيلها في الإعدادات."
        );
      }
      // The useNotification hook should handle obtaining the token
    } catch (err) {
      console.error("Failed to request notifications permissions:", err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // After successful registration, navigate to home
      router.push("home");
      dispatch(clearState());
    }
  }, [isSuccess]);

  return (
    <SafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Container>
            <Header>
              <ProgressBarContainer>
                <ProgressBar progress={progress} />
              </ProgressBarContainer>
              <BackButton onPress={handleBack}>
                <Image
                  source={require("../../assets/icons/back.png")}
                  style={{ width: 24, height: 24 }}
                />
              </BackButton>
            </Header>
            {questions[currentQuestionIndex].image && (
              <GoalImage source={questions[currentQuestionIndex].image} />
            )}
            <Title>{questions[currentQuestionIndex].question}</Title>
            <Subtitle>{questions[currentQuestionIndex].subText}</Subtitle>

            {/* Display Options or Forms based on the current step */}
            {!questions[currentQuestionIndex].isSignUp &&
            !questions[currentQuestionIndex].isNotificationPrompt ? (
              <OptionsContainer>
                {questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <Option
                      key={index}
                      onPress={() => handleSelectOption(index)}
                      selected={selectedOptionIndex === index}
                    >
                      {option.icon && <OptionIcon source={option.icon} />}
                      <OptionText>{option.text}</OptionText>
                    </Option>
                  )
                )}
              </OptionsContainer>
            ) : questions[currentQuestionIndex].isSignUp ? (
              <>
                {/* Sign-Up Form */}
                <Form>
                  {isError && <ErrorText>{errorMessage}</ErrorText>}
                  <InputContainer>
                    <Ionicons name="person-outline" size={20} color="#888" />
                    <Input
                      placeholder="اسم المستخدم"
                      placeholderTextColor="#888"
                      value={inputs.username}
                      onChangeText={(text) =>
                        handleInputChange(
                          "username",
                          capitalizeFirstLetter(text)
                        )
                      }
                      autoCapitalize="none"
                    />
                  </InputContainer>
                  <InputContainer>
                    <Ionicons name="mail-outline" size={20} color="#888" />
                    <Input
                      placeholder="الايميل"
                      placeholderTextColor="#888"
                      value={inputs.email}
                      onChangeText={(text) => handleInputChange("email", text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </InputContainer>
                  <InputContainer>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#888"
                    />
                    <Input
                      secureTextEntry
                      placeholder="باسورد"
                      placeholderTextColor="#888"
                      value={inputs.password}
                      onChangeText={(text) =>
                        handleInputChange("password", text)
                      }
                    />
                  </InputContainer>
                  {/* Terms Acceptance Checkbox */}
                  <CheckBoxContainer
                    onPress={() => setTermsAccepted(!termsAccepted)}
                  >
                    <CheckBox checked={termsAccepted}>
                      {termsAccepted && (
                        <Ionicons name="checkmark" size={12} color="#fff" />
                      )}
                    </CheckBox>
                    <CheckBoxText>
                      لقد قرأت ووافقت على{" "}
                      <Text
                        style={{
                          color: "#1e90ff",
                          textDecorationLine: "underline",
                        }}
                        onPress={() =>
                          WebBrowser.openBrowserAsync(
                            "https://fluentfox.net/privacy-policy"
                          )
                        }
                      >
                        شروط الاستخدام وسياسة الخصوصية
                      </Text>
                    </CheckBoxText>
                  </CheckBoxContainer>
                  {/* MailChimp Opt-In Checkbox */}
                  <CheckBoxContainer
                    onPress={() =>
                      handleInputChange(
                        "mailchimpOptIn",
                        !inputs.mailchimpOptIn
                      )
                    }
                  >
                    <CheckBox checked={inputs.mailchimpOptIn}>
                      {inputs.mailchimpOptIn && (
                        <Ionicons name="checkmark" size={12} color="#fff" />
                      )}
                    </CheckBox>
                    <CheckBoxText>
                      أوافق على تلقي رسائل بريد إلكتروني تحتوي على نصائح تعليمية
                      ومحتوى تسويقي لتحسين لغتي الإنجليزية
                    </CheckBoxText>
                  </CheckBoxContainer>
                </Form>
              </>
            ) : (
              <NotificationContainer>
                <Image
                  source={require("../../assets/icons/notification.png")} // Replace with your notification icon
                  style={{ width: 80, height: 80, marginBottom: 20 }}
                />

                <ButtonGroup>
                  <NotificationButton
                    onPress={() => {
                      // Proceed to the next step even if the user declines notifications
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                    }}
                    style={{ backgroundColor: "#f0f0f0", opacity: 0.5 }}
                  >
                    <ButtonText style={{ color: "#000" }}>
                      ربما لاحقًا
                    </ButtonText>
                  </NotificationButton>
                  <NotificationButton
                    onPress={handleContinue}
                    style={{ opacity: 1 }}
                  >
                    <ButtonText>تشغيل التذكيرات</ButtonText>
                  </NotificationButton>
                </ButtonGroup>
              </NotificationContainer>
            )}

            {/* Continue Button */}
            {!questions[currentQuestionIndex].isNotificationPrompt && (
              <ContinueButton
                onPress={handleContinue}
                enabled={
                  questions[currentQuestionIndex].isSignUp
                    ? !isFetching &&
                      termsAccepted &&
                      inputs.username &&
                      inputs.email &&
                      inputs.password
                    : selectedOptionIndex !== null
                }
                style={{
                  opacity: questions[currentQuestionIndex].isSignUp
                    ? !isFetching &&
                      termsAccepted &&
                      inputs.username &&
                      inputs.email &&
                      inputs.password
                      ? 1
                      : 0.5
                    : selectedOptionIndex !== null
                    ? 1
                    : 0.5,
                }}
              >
                {questions[currentQuestionIndex].isSignUp ? (
                  isFetching ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ButtonText>انشاء حساب جديد</ButtonText>
                  )
                ) : (
                  <ButtonText>متابعة</ButtonText>
                )}
              </ContinueButton>
            )}
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeArea>
  );
};

export default Onboarding;
