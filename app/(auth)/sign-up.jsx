import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { register, clearState } from "../redux/authSlice";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
`;

const Form = styled.View`
  width: 90%;
  padding: 20px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  elevation: 5;
`;

const Header = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
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

const Button = styled.TouchableOpacity`
  background-color: #2946b6;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  height: 45px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  elevation: 3;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
  text-align: center;
`;

const SignUp = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const { isFetching, isError, errorMessage, isSuccess } = useSelector(
    (state) => state.user // Ensure this matches your slice name
  );

  const handleChange = (name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!inputs.username || !inputs.email || !inputs.password) {
      alert("Please fill in all fields");
      return;
    }
    dispatch(register(inputs));
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("subscription"); // Redirect to payment after signup
      dispatch(clearState()); // Reset state after successful registration
    }
  }, [isSuccess]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
          <Form>
            <Header>إنشاء حساب جديد</Header>
            {isError && <ErrorText>{errorMessage}</ErrorText>}
            <InputContainer>
              <Ionicons name="person-outline" size={20} color="#888" />
              <Input
                placeholder="اسم المستخدم"
                placeholderTextColor="#888"
                value={inputs.username}
                onChangeText={(text) => handleChange("username", text)}
              />
            </InputContainer>
            <InputContainer>
              <Ionicons name="mail-outline" size={20} color="#888" />
              <Input
                placeholder="الايميل"
                placeholderTextColor="#888"
                value={inputs.email}
                onChangeText={(text) => handleChange("email", text)}
              />
            </InputContainer>
            <InputContainer>
              <Ionicons name="lock-closed-outline" size={20} color="#888" />
              <Input
                secureTextEntry
                placeholder="باسورد"
                placeholderTextColor="#888"
                value={inputs.password}
                onChangeText={(text) => handleChange("password", text)}
              />
            </InputContainer>
            <Button onPress={handleSubmit} disabled={isFetching}>
              {isFetching ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <ButtonText>انشاء حساب جديد</ButtonText>
              )}
            </Button>
          </Form>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
