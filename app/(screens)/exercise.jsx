import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  Image,
  View,
  Animated,
} from "react-native";
import styled from "styled-components/native";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateExercise, fetchExercise } from "../redux/exerciseSlice";
import { userSelector } from "../redux/authSlice";

// Fun Color Palette
const COLORS = {
  background: "#f9f5ff",
  white: "#ffffff",
  primary: "#6a1b9a",
  secondary: "#ff6f61",
  correct: "#4caf50",
  incorrect: "#f44336",
  shadow: "#000",
  progressBackground: "#d3d3d3",
  progressBar: "#6a1b9a",
  modalOverlay: "rgba(0, 0, 0, 0.6)",
  textPrimary: "#333",
  textSecondary: "#777",
};

// Styled Components
const ScreenContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${COLORS.background};
`;

const QuizBody = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 30px;
  right: 25px;
`;

const CrossIcon = styled.Image`
  width: 30px;
  height: 30px;
`;

const QuestionSection = styled(Animated.View)`
  width: 100%;
  max-width: 600px;
  padding: 25px;
  align-items: center;
  background-color: ${COLORS.white};
  border-radius: 25px;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 5px;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
  elevation: 5;
`;

const QuestionCount = styled.Text`
  font-size: 26px;
  margin-bottom: 15px;
  color: ${COLORS.primary};
  font-weight: bold;
`;

const QuestionText = styled.Text`
  font-size: 24px;
  margin-bottom: 25px;
  text-align: center;
  color: ${COLORS.textPrimary};
  font-family: "Chalkboard SE";
`;

const AnswerSection = styled.View`
  width: 100%;
  margin-top: 25px;
`;

const QuizButton = styled(Animated.createAnimatedComponent(TouchableOpacity))`
  background-color: ${(props) =>
    props.selected
      ? props.isCorrect
        ? COLORS.correct
        : COLORS.incorrect
      : COLORS.white};
  padding: 15px;
  border-radius: 15px;
  margin: 10px 0;
  width: 90%;
  align-items: center;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 5px;
  elevation: 4;
  border: ${(props) =>
    props.selected ? "none" : `2px solid ${COLORS.primary}`};
`;

const AnswerText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => (props.selected ? COLORS.white : COLORS.primary)};
  font-family: "Marker Felt";
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.modalOverlay};
`;

const ModalContent = styled.View`
  width: 85%;
  padding: 35px;
  background-color: ${COLORS.white};
  border-radius: 30px;
  align-items: center;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 6px;
  shadow-opacity: 0.3;
  shadow-radius: 10px;
  elevation: 12;
`;

const ResultImage = styled.Image`
  width: 160px;
  height: 160px;
  margin-bottom: 30px;
`;

const ResultText = styled.Text`
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
  color: ${COLORS.primary};
  font-weight: bold;
  font-family: "Chalkboard SE";
`;

const ModalButton = styled.TouchableOpacity`
  background-color: ${COLORS.secondary};
  padding: 15px 35px;
  border-radius: 20px;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 6px;
  elevation: 5;
`;

const ModalButtonText = styled.Text`
  color: ${COLORS.white};
  font-size: 22px;
  font-weight: bold;
  font-family: "Marker Felt";
`;

const AudioContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: 25px;
`;

const PlayPauseButton = styled.TouchableOpacity`
  padding: 10px;
`;

const PlayPauseImage = styled.Image`
  width: 50px;
  height: 50px;
`;

const ProgressWrapper = styled.View`
  flex: 1;
  margin-left: 15px;
`;

const TimeContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
`;

const TimeText = styled.Text`
  font-size: 14px;
  color: ${COLORS.textSecondary};
`;

// Main Component
const Exercise = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const playbackInstance = useRef(null);
  const progressBarWidth = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0); // in milliseconds
  const [duration, setDuration] = useState(0); // in milliseconds
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bounceAnim] = useState(new Animated.Value(1));

  const router = useRouter();
  const route = useRoute();
  const [selectedSet, setSelectedSet] = useState(route.params?.set || "set1");
  const dispatch = useDispatch();
  const { currentUser } = useSelector(userSelector);

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedSet) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `https://quizeng-022517ad949b.herokuapp.com/api/tests/${selectedSet}`
        );
        setQuestions(response.data.questions);
      } catch (err) {
        console.error("Failed to fetch questions data:", err);
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedSet]);

  // Cleanup Audio on Unmount
  useEffect(() => {
    return () => {
      if (playbackInstance.current) {
        playbackInstance.current.unloadAsync();
      }
    };
  }, []);

  // Load Audio when Current Question Changes
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestionData = questions[currentQuestion];
      if (currentQuestionData?.audioUrl) {
        loadAudio(currentQuestionData.audioUrl);
      } else {
        // If there's no audio for the current question, reset audio states
        if (playbackInstance.current) {
          playbackInstance.current.unloadAsync();
          playbackInstance.current = null;
        }
        setIsPlaying(false);
        setPosition(0);
        setDuration(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, questions]);

  // Load Audio Function
  const loadAudio = async (url) => {
    try {
      // Unload previous sound if any
      if (playbackInstance.current) {
        await playbackInstance.current.unloadAsync();
        playbackInstance.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      playbackInstance.current = sound;
      const status = await sound.getStatusAsync();
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
    } catch (error) {
      console.error("Error loading audio:", error);
    }
  };

  // Playback Status Update Handler
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
        if (playbackInstance.current) {
          playbackInstance.current.setPositionAsync(0);
        }
      }
    } else if (status.error) {
      console.error(`Playback Error: ${status.error}`);
    }
  };

  // Play/Pause Handler
  const handlePlayPause = async () => {
    if (playbackInstance.current) {
      if (isPlaying) {
        await playbackInstance.current.pauseAsync();
      } else {
        await playbackInstance.current.playAsync();
      }
    }
  };

  // Progress Bar Press Handler
  const handleProgressBarPress = async (event) => {
    if (playbackInstance.current && duration && progressBarWidth.current) {
      const { locationX } = event.nativeEvent;
      const totalWidth = progressBarWidth.current;
      const ratio = locationX / totalWidth;
      const newPosition = ratio * duration;
      await playbackInstance.current.setPositionAsync(newPosition);
    }
  };

  // Format Time in mm:ss
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle Answer Selection
  const handleAnswerButtonClick = async (isCorrect, index) => {
    setSelectedAnswer({ index, isCorrect });
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      animateBounce();
    }
    setTimeout(async () => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        // Reset audio states
        if (playbackInstance.current) {
          await playbackInstance.current.unloadAsync();
          playbackInstance.current = null;
        }
        setIsPlaying(false);
        setPosition(0);
        setDuration(0);
        setCurrentQuestion(nextQuestion);
      } else {
        setShowModal(true); // Show the modal at the end of the quiz
      }
      setSelectedAnswer(null);
    }, 1000);
  };

  // Animation for Correct Answer
  const animateBounce = () => {
    bounceAnim.setValue(1);
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle Navigation Back to Stories
  const handleBackToStories = () => {
    setShowModal(false); // Hide the modal
    router.push("stories");
  };

  // Handle Take Home Action
  const handleTakeHome = async () => {
    try {
      if (currentUser && currentUser._id) {
        // Dispatch updateScore to increment by 1
        await dispatch(
          updateExercise({ userId: currentUser._id, incrementBy: 1 })
        ).unwrap();

        // Optionally, refetch the score to ensure the latest value
        dispatch(fetchExercise(currentUser._id));
      }
      // Navigate back to stories
      setShowModal(false);
      router.push("stories");
    } catch (error) {
      console.error("Failed to update score:", error);
      // Optionally, handle the error in the UI without using an alert
    }
  };

  // Current Question Data
  const currentQuestionData = questions[currentQuestion];

  // Calculate Progress Percentage
  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <ScreenContainer>
      {loading ? (
        <LoadingContainer>
          <ActivityIndicator size="large" color={COLORS.secondary} />
        </LoadingContainer>
      ) : error ? (
        <LoadingContainer>
          <Text style={{ color: COLORS.incorrect }}>{error}</Text>
        </LoadingContainer>
      ) : (
        <QuizBody>
          <CloseButton onPress={handleBackToStories}>
            <CrossIcon
              source={require("../../assets/icons/grayCross.png")}
              resizeMode="contain"
            />
          </CloseButton>
          <QuestionSection
            style={{
              transform: [{ scale: bounceAnim }],
            }}
          >
            <QuestionCount>
              Question {currentQuestion + 1} / {questions.length}
            </QuestionCount>
            <QuestionText>{currentQuestionData?.questionText}</QuestionText>

            {/* Audio Player */}
            {currentQuestionData?.audioUrl && (
              <AudioContainer>
                <PlayPauseButton onPress={handlePlayPause}>
                  <PlayPauseImage
                    source={
                      isPlaying
                        ? require("../../assets/icons/pause.png")
                        : require("../../assets/icons/play.png")
                    }
                    resizeMode="contain"
                  />
                </PlayPauseButton>
                <ProgressWrapper>
                  <Pressable
                    onPress={handleProgressBarPress}
                    onLayout={(event) => {
                      progressBarWidth.current = event.nativeEvent.layout.width;
                    }}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        height: 10,
                        backgroundColor: COLORS.progressBackground,
                        borderRadius: 5,
                      }}
                    >
                      <View
                        style={{
                          height: "100%",
                          width: `${progressPercentage}%`,
                          backgroundColor: COLORS.progressBar,
                          borderRadius: 5,
                        }}
                      />
                    </View>
                  </Pressable>
                  <TimeContainer>
                    <TimeText>{formatTime(position)}</TimeText>
                    <TimeText>{formatTime(duration)}</TimeText>
                  </TimeContainer>
                </ProgressWrapper>
              </AudioContainer>
            )}

            <AnswerSection>
              {currentQuestionData?.answerOptions.map((answerOption, index) => (
                <QuizButton
                  key={index}
                  onPress={() =>
                    handleAnswerButtonClick(answerOption.isCorrect, index)
                  }
                  selected={selectedAnswer && selectedAnswer.index === index}
                  isCorrect={
                    selectedAnswer &&
                    selectedAnswer.index === index &&
                    selectedAnswer.isCorrect
                  }
                  style={{
                    transform: [
                      {
                        scale:
                          selectedAnswer &&
                          selectedAnswer.index === index &&
                          selectedAnswer.isCorrect
                            ? bounceAnim
                            : 1,
                      },
                    ],
                  }}
                >
                  <AnswerText
                    selected={selectedAnswer && selectedAnswer.index === index}
                  >
                    {answerOption.answerText}
                  </AnswerText>
                </QuizButton>
              ))}
            </AnswerSection>
          </QuestionSection>
        </QuizBody>
      )}

      {/* Result Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <ModalContainer>
          <ModalContent>
            <ResultImage
              source={require("../../assets/images/congratulations.png")}
              resizeMode="contain"
            />
            <ResultText>
              🎉 Congratulations! 🎉{"\n"}You scored {correctAnswers} out of{" "}
              {questions.length}
            </ResultText>
            <ModalButton onPress={handleTakeHome}>
              <ModalButtonText>Back to Stories</ModalButtonText>
            </ModalButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </ScreenContainer>
  );
};

export default Exercise;
