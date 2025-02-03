import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import styled from "styled-components/native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";

const ScreenContainer = styled.ScrollView`
  flex: 1;
  background-color: #f5f5f5;
  padding: 10px 20px 20px;
`;

const ExplanationText = styled.Text`
  font-size: 16px;
  color: #333;
  padding: 10px;
  background-color: #eef;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const QuestionContainer = styled.View`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  shadow-color: #000;
  shadow-offset: 0 3px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const QuestionText = styled.Text`
  font-size: 18px;
  margin-bottom: 10px;
`;

const TextInputStyled = styled.TextInput`
  height: 40px;
  border-width: 1px;
  border-color: ${({ borderColor }) => borderColor || "#ddd"};
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #fff;
`;

const Button = styled.TouchableOpacity`
  padding: 10px 15px;
  background-color: #007bff;
  align-items: center;
  margin-right: 10px;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  color: #fff;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const ProgressBarContainer = styled.View`
  flex: 1;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 10px;
`;

const ProgressBar = styled.View`
  height: 100%;
  background-color: #56c1ff;
  width: ${({ progress }) => `${progress}%`};
  align-self: flex-end;
`;

const CroBut = styled.TouchableOpacity``;

const CrossIcon = styled.Image`
  width: 30px;
  height: 30px;
`;

const Grammar = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [translation, setTranslation] = useState("");
  const [progress, setProgress] = useState(0);
  const route = useRoute();
  const router = useRouter();
  const [selectedSet, setSelectedSet] = useState(route.params?.set || "set1");

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedSet) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `https://quizeng-022517ad949b.herokuapp.com/api/grammar/${selectedSet}`
        );
        setQuestions(response.data.questions);
        setExplanation(response.data.explanation);
        setTranslation(response.data.translation);
        const initialAnswers = {};
        response.data.questions.forEach((q, idx) => {
          initialAnswers[idx] = "";
        });
        setAnswers(initialAnswers);
      } catch (err) {
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedSet]);

  const handleAnswerChange = (text, index) => {
    setAnswers({
      ...answers,
      [index]: text,
    });
  };

  const checkAnswer = (index) => {
    const question = questions[index];
    const userAnswer = answers[index].trim().toLowerCase();
    const isCorrect = question.answerOptions.some(
      (opt) => opt.isCorrect && opt.answerText.toLowerCase() === userAnswer
    );
    setCorrectAnswers({
      ...correctAnswers,
      [index]: isCorrect,
    });

    if (isCorrect || correctAnswers[index] !== undefined) {
      const newProgress =
        ((Object.values(correctAnswers).filter(Boolean).length + 1) /
          questions.length) *
        100;
      setProgress(newProgress);
    }
  };

  const showAnswer = (index) => {
    const question = questions[index];
    const correctOption = question.answerOptions.find((opt) => opt.isCorrect);
    setAnswers({
      ...answers,
      [index]: correctOption.answerText,
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScreenContainer>
          <HeaderContainer>
            <ProgressBarContainer>
              <ProgressBar progress={progress} />
            </ProgressBarContainer>
            <CroBut onPress={() => router.push("create")}>
              <CrossIcon
                source={require("../../assets/icons/grayCross.png")}
                resizeMode="contain"
              />
            </CroBut>
          </HeaderContainer>
          <ExplanationText>{explanation}</ExplanationText>
          <ExplanationText>{translation}</ExplanationText>
          {questions.map((question, index) => (
            <QuestionContainer key={index}>
              <QuestionText>
                {index + 1}) {question.questionText}
              </QuestionText>
              <TextInputStyled
                value={answers[index]}
                onChangeText={(text) => handleAnswerChange(text, index)}
                placeholder="Type your answer here..."
                borderColor={
                  correctAnswers[index] !== undefined
                    ? correctAnswers[index]
                      ? "green"
                      : "red"
                    : "#ddd"
                }
                editable={correctAnswers[index] === undefined}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  onPress={() => checkAnswer(index)}
                  disabled={correctAnswers[index] !== undefined}
                >
                  <ButtonText>Check</ButtonText>
                </Button>
                <Button onPress={() => showAnswer(index)}>
                  <ButtonText>Show</ButtonText>
                </Button>
              </View>
              {correctAnswers[index] !== undefined && (
                <Text
                  style={{
                    color: correctAnswers[index] ? "green" : "red",
                    marginTop: 5,
                  }}
                >
                  {correctAnswers[index] ? "Correct!" : "Incorrect"}
                </Text>
              )}
            </QuestionContainer>
          ))}
        </ScreenContainer>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Grammar;
