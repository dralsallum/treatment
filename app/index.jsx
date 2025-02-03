// index.jsx
import { Link, Redirect, router } from "expo-router";
import React, { useState } from "react";
import { useSelector } from "react-redux"; // For accessing Redux state
import { userSelector } from "../app/redux/authSlice"; // Adjust import path to your authSlice
import { StatusBar } from "react-native";
import styled from "styled-components/native";
import LottieView from "lottie-react-native";

const Index = () => {
  // Local state for any loading you may do
  const [isLoading, setIsLoading] = useState(false);

  // 1) Grab the user from Redux
  const { currentUser } = useSelector(userSelector);

  // 2) If logged in, redirect immediately
  if (currentUser) {
    return <Redirect href="home" />;
  }

  // Handlers for your buttons
  const handleButtonPress = () => {
    router.push("onboarding");
  };
  const handleButtonPress1 = () => {
    router.push("sign-in");
  };

  return (
    <SafeArea>
      <Container>
        <StatusBar barStyle="light-content" />
        <LottieView
          source={require("./utils/foxAnimation - 1724582171334.json")}
          autoPlay
          loop
          style={{
            width: 250,
            height: 250,
          }}
        />
        <Subtitle>ابدأ رحلتك التعليمية. اليوم!</Subtitle>
        <ButtonContainer>
          <Button onPress={handleButtonPress} isLoading={isLoading}>
            <ButtonText>ابدأ الآن</ButtonText>
          </Button>
          <ButtonSign onPress={handleButtonPress1}>
            <TextSign>لديك حساب؟ تسجيل الدخول</TextSign>
          </ButtonSign>
        </ButtonContainer>
      </Container>
    </SafeArea>
  );
};

export default Index;

// --------------- Styled Components ---------------

const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #f7f7f7;
`;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-bottom: 50px;
`;

const Subtitle = styled.Text`
  color: #4c47e8;
  font-size: 28px;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 600;
  letter-spacing: 1.5px;
  line-height: 34px;
  padding: 0 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  background-color: #f7f7f7;
`;

const ButtonContainer = styled.View`
  width: 100%;
  padding: 0 20px;
  position: absolute;
  bottom: 30px;
`;

const Button = styled.TouchableOpacity`
  border-radius: 25px;
  padding: 15px 0;
  margin-bottom: 10px;
  width: 100%;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};
  background-color: #4c47e8;
`;

const ButtonSign = styled.TouchableOpacity`
  border-radius: 25px;
  padding: 15px 0;
  width: 100%;
  border: 1px solid #4c47e8;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  background-color: #ffffff;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

const TextSign = styled.Text`
  color: #4c47e8;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;
