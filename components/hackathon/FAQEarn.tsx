import React from "react";
import { Container, Flex } from "@chakra-ui/react";
import { LandingFAQ } from "components/landing-pages/faq";
import { Link, Text } from "tw-components";

const faqs = [
  {
    title: "How do we integrate the Earn Alliance task system?",
    description: (
      <Text fontSize="16px" color="#fff">
        Check out the docs, and email{" "}
        <Link
          href="mailto:hackathon@earnalliance.com"
          style={{ color: "lightblue", textDecoration: "underline" }}
        >
          hackathon@earnalliance.com
        </Link>{" "}
        to access the test dashboard for Earn Alliance challenges and the event
        system.
      </Text>
    ),
  },
  {
    title: "When is the hackathon being held?",
    description: (
      <Text fontSize="16px" color="#fff">
        The event will be held between February 27th — March 16 2024.
      </Text>
    ),
  },
  {
    title: "Where is the hackathon held?",
    description: (
      <Text fontSize="16px" color="#fff">
        This is an online hackathon featuring an in-person lunch, presentation,
        and awards event at the thirdweb offices in San Francisco. Teams will
        receive the location after registering. If you are chosen to present and
        can&apos;t attend in person, you will be notified and can present
        remotely.
      </Text>
    ),
  },
  {
    title: "Who is eligible to participate in the hackathon?",
    description: (
      <Text fontSize="16px" color="#fff">
        This event is open to all! We welcome everybody from beginners building
        their first project to experienced developers (with or without
        blockchain experience)
      </Text>
    ),
  },
  {
    title: "What is the total number of participants I can have on my team?",
    description: (
      <Text fontSize="16px" color="#fff">
        The minimum number of participants in a team is 1, while the maximum
        number is 4
      </Text>
    ),
  },
  {
    title: "Do all of my team members have to register for the hackathon?",
    description: (
      <Text fontSize="16px" color="#fff">
        Yes! Only registered individuals are eligible to participate. Please
        ensure that at least one member of your team has registered the entire
        team during their submission
      </Text>
    ),
  },
  {
    title: "Will I need a team in order to participate?",
    description: (
      <Text fontSize="16px" color="#fff">
        While participants can submit a project individually, we encourage
        everyone to form teams (of up to a maximum of 4 members) where possible
        to make the ideation and development process more enjoyable!
      </Text>
    ),
  },
];

const FAQEarn = ({ TRACKING_CATEGORY }: { TRACKING_CATEGORY: string }) => {
  return (
    <Container maxW={"container.page"} as={Flex} justifyContent="center">
      <LandingFAQ
        hideMarginTop
        TRACKING_CATEGORY={TRACKING_CATEGORY}
        title={"FAQ"}
        faqs={faqs}
        titleSize="title.2xl"
      />
    </Container>
  );
};

export default FAQEarn;
