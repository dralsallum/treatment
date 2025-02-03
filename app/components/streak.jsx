// Streak.js (Frontend)
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userSelector } from "../redux/authSlice";
import styled from "styled-components/native";
import LottieView from "lottie-react-native";
import { View, Image } from "react-native";

// Styled Components
const StreakContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const StreakMessage = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #ff6f61;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const DaysRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  margin-vertical: 20px;
`;

const DayItem = styled.View`
  align-items: center;
`;

const DayCircle = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 25px;
  border: 2px solid ${({ completed }) => (completed ? "#FFD700" : "#e1e1e1")};
  background-color: ${({ completed }) => (completed ? "#FFD700" : "#ffffff")};
  justify-content: center;
  align-items: center;
  margin: 5px;
  elevation: ${({ completed }) => (completed ? 4 : 0)};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
`;

const DayText = styled.Text`
  font-size: 14px;
  color: ${({ completed }) => (completed ? "#000" : "#333333")};
  margin-top: 5px;
`;

const Streak = () => {
  const { currentUser } = useSelector(userSelector);
  const streakCount = currentUser?.streak?.count || 0;

  // Get the timestamp instead of a Date object
  const lastUpdatedTime = currentUser?.streak?.lastUpdated
    ? new Date(currentUser.streak.lastUpdated).getTime()
    : null;

  const [rotatedDays, setRotatedDays] = useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);

  useEffect(() => {
    if (lastUpdatedTime && streakCount > 0) {
      const startDate = new Date(lastUpdatedTime);
      startDate.setDate(startDate.getDate() - (streakCount - 1));
      const startDayIndex = startDate.getDay();
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const rotated = [
        ...daysOfWeek.slice(startDayIndex),
        ...daysOfWeek.slice(0, startDayIndex),
      ];
      setRotatedDays(rotated);
    } else {
      setRotatedDays(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
    }
  }, [lastUpdatedTime, streakCount]); // Use the timestamp here

  const isDayCompleted = (index) => {
    return index < streakCount;
  };

  return (
    <StreakContainer>
      <LottieView
        source={require("../utils/fireAnimation - 1724581924405.json")}
        autoPlay
        loop
        style={{ width: 120, height: 120 }}
      />
      <DaysRow>
        {rotatedDays.map((day, index) => (
          <DayItem key={index}>
            <DayCircle completed={isDayCompleted(index)}>
              {isDayCompleted(index) && (
                <Image
                  source={require("../../assets/icons/check.png")}
                  style={{ width: 20, height: 20 }}
                />
              )}
            </DayCircle>
            <DayText completed={isDayCompleted(index)}>{day}</DayText>
          </DayItem>
        ))}
      </DaysRow>
      <StreakMessage>
        {streakCount > 0
          ? `حافظت على سلسلة من ${streakCount} أيام! استمر يابطل!`
          : "ابدأ سلسلة تعلمك اليوم!"}
      </StreakMessage>
    </StreakContainer>
  );
};

export default Streak;
