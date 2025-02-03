import styled from "styled-components/native";

export const LoadingAll = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

export const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

export const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

export const Header = styled.View`
  flex-direction: row-reverse;
  align-items: center;
  margin: 30px;
`;

export const BackButton = styled.TouchableOpacity``;

export const ProgressBarContainer = styled.View`
  flex: 1;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-left: 4px;
  flex-direction: row-reverse;
`;

export const ProgressBar = styled.View`
  height: 100%;
  background-color: #4c47e8;
  width: ${({ progress }) => `${progress}%`};
`;

export const Footer = styled.View`
  position: absolute;
  bottom: 30px;
  width: 100%;
  padding: 10px 0;
  background-color: #fff;
`;

export const CheckButton = styled.TouchableOpacity`
  align-self: center;
  justify-content: center;
  background-color: #4c47e8;
  width: 85%;
  padding: 10px 0px;
  border-radius: 20px;
  margin: 5px;
  border: 2px solid #c9c9c9;
`;

export const QuestionText = styled.Text`
  font-size: 24px;
  font-weight: 500;
  text-align: right;
  margin: 20px;
`;

export const HeartContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const HeartText = styled.Text`
  font-size: 23px;
  font-weight: bold;
  color: #ff0000;
  margin-right: 5px;
`;

export const HeartImage = styled.Image`
  width: 28px;
  height: 28px;
`;

export const DialogueView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;
export const MulCon = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;
export const MulTop = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const MulMid = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: auto;
  flex-wrap: wrap;
  margin: 20px 0;
`;

export const MulMidTex = styled.Text`
  font-size: 22px;
  font-weight: 500;
  color: #333;
  margin: 0 5px;
`;

export const SelectedOptionText = styled.Text`
  color: #494949;
  font-size: 1٨px;
  font-weight: 500;
  text-align: center;
  line-height: 24px;
`;
export const SelectedOptionButton = styled.TouchableOpacity`
  background-color: #ffffff;
  padding: 3px 8px;
  border-radius: 12px;
  border: 2px solid rgb(206, 206, 206);
  justify-content: center;
  align-items: center;
  min-width: 80px;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: -2px 2px;
  shadow-opacity: 0.5;
  shadow-radius: 0.5px;
  elevation: 3;
`;

export const MulMidAn = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
`;

export const SelectedOptionWrapper = styled.View`
  min-width: 100px;
  height: auto;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  flex-shrink: 0; /* Prevents the wrapper from shrinking */
  flex-grow: 0; /* Prevents the wrapper from growing */
  flex-direction: row;
`;

export const PlaceholderText = styled.Text`
  font-size: 22px;
  font-weight: 500;
  color: #c9c9c9;
  text-align: center;
`;

export const MulImage = styled.Image`
  width: 180px;
  height: 180px;
`;

export const CharacterImage = styled.Image`
  width: 80px;
  height: 160px;
`;

export const SpeechBubble = styled.View`
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #ddd;
  max-width: 60%;
  gap: 5px;
`;

export const LineContainer = styled.View`
  align-items: center;
`;
export const AllView = styled.View`
  align-items: center;
`;

export const LineOne = styled.View`
  width: 90%;
  height: 0px;
  background-color: transparent;
  border-bottom-width: 2px;
  border-bottom-color: #c9c9c9;
  margin-top: -10px;
`;

export const LineTwo = styled.View`
  width: 90%;
  height: 60px;
  background-color: transparent;
  border-bottom-width: 2px;
  border-bottom-color: #c9c9c9;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  direction: ${({ isArabic }) => (isArabic ? "rtl" : "ltr")};
`;

export const SpeechText = styled.Text`
  color: #000;
  font-size: 18px;
`;

export const OptionsContainer = styled.View`
  margin-top: 50px;
  flex-direction: row;
  align-self: center;
  justify-content: center;
  flex-wrap: wrap;
`;

export const OptionButton = styled.TouchableOpacity`
  align-self: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 12px;
  margin: 5px;
  border: 2px solid rgb(206, 206, 206);
  min-width: 60px;
  min-height: 20px;
  shadow-color: rgba(0, 0, 0, 0.2);
  shadow-offset: -2px 2px;
  shadow-opacity: 0.5;
  shadow-radius: 0.5px;
  elevation: 3;
  background-color: #ffffff;
`;

export const OptionText = styled.Text`
  color: #494949;
  font-size: 22px;
  font-weight: 500;
  text-align: center;
`;

export const BottomModalContainer = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 20%;
  justify-content: center;
  align-items: center;
  background-color: ${({ isCorrect }) => (isCorrect ? "#d4edda" : "#f8d7da")};
  border-top-width: 2px;
  border-color: ${({ isCorrect }) => (isCorrect ? "#4caf50" : "#f44336")};
`;

export const ModalText = styled.Text`
  font-size: 20px;
  margin-bottom: 10px;
  text-align: center;
  color: ${({ isCorrect }) => (isCorrect ? "#155724" : "#721c24")};
`;

export const NextButton = styled.TouchableOpacity`
  background-color: ${({ isCorrect }) => (isCorrect ? "#4caf50" : "#f44336")};
  padding: 10px 20px;
  border-radius: 10px;
  width: 100px;
  align-items: center;
`;

export const NextButtonText = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
`;

export const ResultModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;
export const TryModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ResultModalContent = styled.View`
  width: 90%;
  padding: 20px;
  height: 80%;
  background-color: #fff;
  border-radius: 10px;
  align-items: center;

  justify-content: space-around;
`;
export const TryModalContent = styled.View`
  width: 90%;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  align-items: center;
  border-width: 2px;
  border-color: #4caf50;
`;
export const ResCon = styled.View``;

export const ResultText = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #000;
  margin-bottom: 20px;
  text-align: center;
`;
export const TryText = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #000;
  margin-bottom: 20px;
  text-align: center;
`;

export const RestartButton = styled.TouchableOpacity`
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 18px;
  width: 300px;
  align-items: center;
  margin-top: 15px;
  border: 2px solid #ced5dd;
`;

export const ConButton = styled.TouchableOpacity`
  background-color: #4c47e8;
  padding: 10px 20px;
  border-radius: 18px;
  width: 300px;
  align-items: center;
`;

export const TryButton = styled.TouchableOpacity`
  background-color: #4caf50;
  padding: 10px 20px;
  border-radius: 10px;
`;

export const RestartButtonText = styled.Text`
  color: #000;
  font-size: 18px;
  text-align: center;
`;
export const ConButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  text-align: center;
`;
export const TryButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: 500;
  text-align: center;
`;

export const ExCon = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin: 0 20px;
  gap: 4px;
`;
export const ReCon = styled.View`
  flex-direction: row-reverse;
  padding: 10px;
  border: 2px solid #dae2eb;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
`;
export const MidCon = styled.View`
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;
export const ScCon = styled.View`
  flex-direction: row-reverse;
  padding: 10px;
  border: 2px solid #dae2eb;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
`;
export const StCon = styled.View`
  flex-direction: row;
  gap: 4px;
  align-items: center;
`;

export const ScoreCon = styled.View`
  flex-direction: row;
  gap: 4px;
  align-items: center;
`;
export const ScoreText = styled.Text`
  color: #4a5766;
`;
export const TeTex = styled.Text`
  color: #4b5867;
  font-size: 16px;
`;

export const ImageOptionsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

export const TextView = styled.View`
  height: 120px;
  width: 100%;
  font-size: 20px;
  margin-bottom: auto;
`;

export const TextAnswerInput = styled.TextInput`
  height: 140px;
  width: 90%;
  border-radius: 10px;
  border: 1px solid #c9c9c9;
  padding: 10px;
  font-size: 20px;
  text-align: left;
  background-color: #f7f7f7;
  text-align-vertical: top;
  align-self: center;
  color: #000;
`;

export const WriCon = styled.View`
  flex-direction: column;
`;

export const ImageOptionContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ImageOptionButton = styled.TouchableOpacity`
  margin: 10px;
  border-radius: 15px;
  overflow: hidden;
  border-width: 3px;
  border-color: ${({ showResult, isSelected, isCorrect }) => {
    if (showResult && isSelected) {
      return isCorrect ? "#4CAF50" : "#F44336";
    }
    return "#c9c9c9";
  }};
  width: 44%;
  height: 160px;
  opacity: ${({ selected }) => (selected ? 0.5 : 1)};
`;

export const ImageOption = styled.Image`
  width: 100%;
  height: 75%;
  margin-top: 12px;
`;

export const ExText = styled.Text`
  color: #494949;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  margin-top: 5px;
  margin-bottom: 10px;
`;
export const ReTex = styled.Text`
  color: #4a5766;
`;
export const PerTex = styled.Text`
  color: #4a5766;
`;
export const StText = styled.Text`
  color: #4a5766;
`;

export const RealAll = styled.View`
  align-items: center;
  margin-top: -10px;
`;
export const RealView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const LineReal = styled.View`
  align-items: center;
`;

export const OptionsReal = styled.View`
  margin-top: 20px;
  align-self: stretch;
  align-items: center;
`;

export const LineAct = styled.View`
  width: 90%;
  height: 60px;
  background-color: transparent;

  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  direction: ${({ isArabic }) => (isArabic ? "rtl" : "ltr")};
`;

export const SelectedRealButton = styled.TouchableOpacity`
  background-color: #ffffff;
  padding: 15px;
  margin: 10px 0;
  border-radius: 10px;
  border: 2px solid rgb(206, 206, 206);
  opacity: ${({ isSelected }) => (isSelected ? 0.5 : 1)};
  justify-content: center;
  align-items: center;
  width: 300px;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: -2px 2px;
  shadow-opacity: 0.5;
  shadow-radius: 0.5px;
  elevation: 3;
`;

export const RealText = styled.Text`
  color: #494949;
  font-size: 22px;
  font-weight: 500;
  text-align: center;
`;
export const UnderText = styled.Text`
  color: #494949;
  font-size: 22px;
  font-weight: 500;
  text-align: left;
  align-self: left;
  margin-left: 30px;
  margin-top: 3px;
`;

export const StreView = styled.View`
  flex-direction: row;
  width: 100%;
  border-radius: 20px;
  margin: 10px 0;
  border: 2px solid #e1e1e1;
  justify-content: space-between;
  padding: 20px;
  background-color: #f8f8f8;
`;

export const StreSub = styled.View`
  align-items: center;
`;

export const StreRo = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 20px;
  margin-bottom: 5px;
  border: 2px solid ${(props) => (props.completed ? "#4caf50" : "#c9c9c9")};
  background-color: ${(props) => (props.completed ? "#4caf50" : "#fff")};
  justify-content: center;
  align-items: center;
`;

export const StreTex = styled.Text`
  font-size: 14px;
  color: #333;
  text-align: center;
`;
export const StreText = styled.Text`
  font-size: 24px;
  color: #000;
  text-align: center;
  margin-bottom: 10px;
`;
export const ExpText = styled.Text`
  font-size: 14px;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
`;

export const CheIco = styled.Image`
  width: 20px;
  height: 20px;
`;

export const DayCircle = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 20px;
  border: 2px solid ${(props) => (props.completed ? "#4caf50" : "#e1e1e1")};
  background-color: ${(props) => (props.completed ? "#4caf50" : "#ffffff")};
  justify-content: center;
  align-items: center;
`;

export const DayText = styled.Text`
  font-size: 12px;
  color: ${(props) => (props.completed ? "#333333" : "#333333")};
  margin-top: 5px;
`;
