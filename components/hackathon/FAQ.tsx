import React from "react";
import { Container, Flex } from "@chakra-ui/react";
import { LandingFAQ } from "components/landing-pages/faq";

const faqs = [
  {
    title: "When is the hackathon being held?",
    description: "The event will be held from December 8 to December 10, 2023.",
  },
  {
    title: "Where is the hackathon held?",
    description:
      "This will be an in-person event held at the thirdweb offices in San Francisco. Teams will receive invites with a Location following registration.",
  },
  {
    title: "Who is eligible to participate in the hackathon?",
    description:
      "This event is open to all! We welcome everybody from beginners building their first project to experienced developers (with or without blockchain experience).",
  },
  {
    title: "What is the total number of participants I can have on my team?",
    description:
      "The minimum number of participants in a team is 1, while the maximum number is 4.",
  },
  {
    title: "Do all of my team members have to register for the hackathon?",
    description:
      "Yes! Only registered individuals are eligible to participate. Please ensure that at least one member of your team has registered the entire team during their submission.",
  },
  {
    title: "Will I need a team in order to participate?",
    description:
      "While participants can submit a project individually, we encourage everyone to form teams (of up to a maximum of 4 members) where possible to make the ideation and development process more enjoyable!",
  },
];

const FAQ = ({ TRACKING_CATEGORY }: { TRACKING_CATEGORY: string }) => {
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

export default FAQ;
