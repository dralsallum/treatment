import React, { useEffect } from "react";
import { Image, View } from "react-native";
import { useRouter } from "expo-router";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 20px;
`;

const SuccessImage = styled.Image`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;

const SuccessText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: rgb(14, 190, 117);
  text-align: center;
  margin-bottom: 20px;
`;

const SubText = styled.Text`
  font-size: 16px;
  color: rgb(75, 87, 102);
  text-align: center;
`;

const Success = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home screen after 5 seconds
    const timer = setTimeout(() => {
      router.replace("/home"); // Replace with your home route
    }, 5000);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Container>
      <SuccessImage source={require("../../assets/images/success.png")} />
      <SuccessText>تمت عملية الدفع بنجاح!</SuccessText>
      <SubText>
        تهانينا! لقد تمت عملية الدفع بنجاح. سيتم توجيهك إلى الصفحة الرئيسية
        قريبًا.
      </SubText>
    </Container>
  );
};

export default Success;
