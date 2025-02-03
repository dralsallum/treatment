import React from "react";
import LottieView from "lottie-react-native";
import { Text, View } from "react-native";
import styled from "styled-components/native";

// Container for the loading indicator
const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

// Style for the text
const LoadingText = styled(Text)`
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #fd8627;
  text-align: center;
  letter-spacing: 1.5px;
`;

const MainAnimationWrapper = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CustomLoadingIndicator = () => {
  return (
    <LoadingContainer>
      <LottieView
        source={require("../utils/foxAnimation - 1724582171334.json")}
        autoPlay
        loop
        style={{
          width: 250, // Adjust the size as needed
          height: 250,
        }}
      />
      <MainAnimationWrapper>
        <LoadingText>جاري التحميل</LoadingText>

        <LottieView
          source={require("../utils/Animation - 1724581539425.json")}
          autoPlay
          loop
          style={{
            width: 100, // Smaller secondary animation
            height: 100,
          }}
        />
      </MainAnimationWrapper>
    </LoadingContainer>
  );
};

export default CustomLoadingIndicator;
