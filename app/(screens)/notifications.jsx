import React, { useState } from "react";
import styled from "styled-components/native";
import { Modal, Text, TouchableOpacity, View } from "react-native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* Slightly darker background */
`;

const DialogBox = styled.View`
  width: 85%;
  background-color: #fff;
  padding: 25px;
  border-radius: 16px;
  align-items: center;
  elevation: 10;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4.65px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  color: #333;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 25px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${({ isPrimary }) => (isPrimary ? "#007aff" : "#ccc")};
  padding: 12px 25px;
  border-radius: 8px;
  margin-top: 10px;
  width: 80%;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: ${({ isPrimary }) => (isPrimary ? "#fff" : "#333")};
  font-size: 16px;
  font-weight: bold;
`;

const NotificationPermissionScreen = () => {
  const [modalVisible, setModalVisible] = useState(true);

  const handlePermission = (allowed) => {
    alert(`الإذن ${allowed ? "ممنوح" : "مرفوض"}`);
    setModalVisible(false);
  };

  return (
    <Container>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Container>
          <DialogBox>
            <Title>فلونت فوكس يرغب بإرسال إشعارات إليك</Title>
            <Subtitle>
              قد تتضمن الإشعارات تنبيهات، أصوات، وشارات على الأيقونات
            </Subtitle>
            <Button isPrimary onPress={() => handlePermission(true)}>
              <ButtonText isPrimary>السماح</ButtonText>
            </Button>
            <Button onPress={() => handlePermission(false)}>
              <ButtonText>عدم السماح</ButtonText>
            </Button>
          </DialogBox>
        </Container>
      </Modal>
    </Container>
  );
};

export default NotificationPermissionScreen;
