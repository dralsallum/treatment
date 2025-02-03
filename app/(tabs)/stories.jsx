// Stories.jsx
import React from "react";
import { SafeAreaView, Image } from "react-native";
import styled from "styled-components/native";

// ----- STYLED COMPONENTS -----
const Container = styled.View`
  flex: 1;
  background-color: #d1e6fb;
  position: relative; /* Needed so our Footer can be absolutely positioned inside this container */
`;

// We add some bottom padding so the scrollable Steps won't be hidden behind the footer image
const ContentWrapper = styled.ScrollView.attrs(() => ({
  contentContainerStyle: { paddingBottom: 120 }, // Enough space for the fixed footer
}))`
  padding: 20px;
`;

const HeaderContainer = styled.View``;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #000;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 24px;
`;

const StepsContainer = styled.View`
  flex: 1;
`;

const StepRow = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
  position: relative;
`;

const TimelineContainer = styled.View`
  width: 30px; /* Holds the circle + vertical line */
  align-items: center;
`;

/**
 * Dynamically set circle style:
 *  - If active, black fill
 *  - Otherwise, white fill & black border
 */
const Circle = styled.View`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  margin-top: 4px;
  ${(props) =>
    props.active
      ? `
      background-color: #000;
    `
      : `
      background-color: #fff;
      border-width: 2px;
      border-color: #000;
    `}
`;

/**
 * We conditionally hide the VerticalLine on the last step
 * (so no line extends below the final dot).
 */
const VerticalLine = styled.View`
  position: absolute;
  left: 14px;
  width: 2px;
  height: 100%;
  background-color: #ccc; /* light gray line */
  top: 16px; /* start below the circle */
`;

const Card = styled.View`
  flex: 1;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px; /* add comfortable padding */
  margin-left: 8px;

  /* subtle shadow */
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

/**
 * Top row: left column (title + points) & right column (icon)
 */
const CardTopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CardLeftColumn = styled.View`
  flex-direction: column;
`;

const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;

const CardPoints = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #fcb900;
  margin-top: 2px;
`;

const ProfileIcon = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

const CardDesc = styled.Text`
  margin-top: 6px;
  font-size: 16px;
  color: #444;
`;

/**
 * Nearly full-width button
 */
const StartButton = styled.TouchableOpacity`
  background-color: #0055ff;
  border-radius: 6px;
  margin-top: 14px;
  width: 100%;
  padding: 14px;
`;

const StartButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
`;

/**
 * Footer pinned to the bottom of Container
 */
const FooterImageContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

//
// ----- MAIN COMPONENT -----
//
const Stories = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d1e6fb" }}>
      <Container>
        <ContentWrapper>
          {/* HEADER */}
          <HeaderContainer>
            <Title>Welcome to Rewards</Title>
            <Subtitle>Get ready to earn your first 2,500 points!</Subtitle>
          </HeaderContainer>

          {/* STEPS */}
          <StepsContainer>
            {/* STEP 1 (Active) */}
            <StepRow>
              <TimelineContainer>
                <VerticalLine />
                <Circle active={true} />
              </TimelineContainer>

              <Card>
                <CardTopRow>
                  <CardLeftColumn>
                    <CardTitle>Learn the basics</CardTitle>
                    <CardPoints>250 points</CardPoints>
                  </CardLeftColumn>
                  <ProfileIcon
                    source={require("../../assets/icons/profile.png")}
                  />
                </CardTopRow>

                <CardDesc>
                  Get the ins and outs of Rewards so you earn points with every
                  coupon.
                </CardDesc>

                <StartButton>
                  <StartButtonText>Start</StartButtonText>
                </StartButton>
              </Card>
            </StepRow>

            {/* STEP 2 (Not active) */}
            <StepRow>
              <TimelineContainer>
                <VerticalLine />
                <Circle active={false} />
              </TimelineContainer>

              <Card>
                <CardTopRow>
                  <CardLeftColumn>
                    <CardTitle>Double-check your info</CardTitle>
                    <CardPoints>750 points</CardPoints>
                  </CardLeftColumn>
                  <ProfileIcon
                    source={require("../../assets/icons/flask.png")}
                  />
                </CardTopRow>
              </Card>
            </StepRow>

            {/* STEP 3 (No line under last dot) */}
            <StepRow>
              <TimelineContainer>
                {/* Omit <VerticalLine> here */}
                <Circle active={false} />
              </TimelineContainer>

              <Card>
                <CardTopRow>
                  <CardLeftColumn>
                    <CardTitle>Use your GoodRx coupon</CardTitle>
                    <CardPoints>1,500 points</CardPoints>
                  </CardLeftColumn>
                  <ProfileIcon
                    source={require("../../assets/icons/profile.png")}
                  />
                </CardTopRow>
              </Card>
            </StepRow>
          </StepsContainer>
        </ContentWrapper>

        {/* FOOTER IMAGE pinned at bottom */}
        <FooterImageContainer>
          <Image
            source={require("../../assets/images/rewards.jpg")}
            style={{
              width: "100%",
              height: 100,
              resizeMode: "contain",
            }}
          />
        </FooterImageContainer>
      </Container>
    </SafeAreaView>
  );
};

export default Stories;
