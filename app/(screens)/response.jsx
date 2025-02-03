import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import styled from "styled-components/native";
import { publicRequest } from "../../requestMethods";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";

const ResetContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #f0f4f8;
  padding: 10px;
`;

const ResetFormContainer = styled.View`
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 15px;
  background-color: #ffffff;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 4.65px;
  elevation: 5;
`;

const ResetHeader = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #4c47e8;
  margin-bottom: 20px;
  text-align: center;
`;

const ResetSubHeader = styled.Text`
  font-size: 16px;
  color: #666;
  margin-bottom: 15px;
  text-align: center;
`;

const ResetInput = styled.TextInput`
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 0 15px;
  background-color: #f9f9f9;
  font-size: 16px;
`;

const ResetButton = styled.TouchableOpacity`
  background-color: #4c47e8;
  border-radius: 25px;
  height: 50px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const ResetButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const ErrorContainer = styled.Text`
  color: red;
  margin-bottom: 15px;
  text-align: center;
`;

const SuccessContainer = styled.Text`
  color: green;
  margin-bottom: 15px;
  text-align: center;
`;

const SecondaryButton = styled.TouchableOpacity`
  margin-top: 20px;
  align-items: center;
`;

const SecondaryButtonText = styled.Text`
  color: #6b7c93;
  font-size: 16px;
  font-weight: bold;
`;

const Response = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (text) => {
    setEmail(text);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await publicRequest.post(
        "/users/reset-password-request",
        {
          email,
        }
      );
      setMessage(
        response.data.message || "الرقم السري لحسابك تم ارساله الى ايميلك"
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "فشل في اتمام العملية");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirect = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ResetContainer>
          <ResetFormContainer>
            <ResetHeader>اعادة تعيين كلمة المرور</ResetHeader>
            {message ? (
              message.includes("تم") ? (
                <SuccessContainer>{message}</SuccessContainer>
              ) : (
                <ErrorContainer>{message}</ErrorContainer>
              )
            ) : null}
            <ResetSubHeader>أدخل البريد الإلكتروني</ResetSubHeader>
            <ResetInput
              placeholder="أدخل البريد الإلكتروني"
              placeholderTextColor="#888"
              value={email}
              onChangeText={handleChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <ResetButton onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <ResetButtonText>إرسال رابط إعادة التعيين</ResetButtonText>
              )}
            </ResetButton>
            <SecondaryButton onPress={handleRedirect}>
              <SecondaryButtonText>الرجوع لتسجيل الدخول</SecondaryButtonText>
            </SecondaryButton>
          </ResetFormContainer>
        </ResetContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Response;
