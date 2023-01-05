import { Flex, List, ListItem } from "@chakra-ui/react";
import type { FC } from "react";
import { Heading } from "tw-components";

const requirements = [
  {
    title: "1. Project Details",
    items: [
      "a. Name and overview of project",
      "b. Names/pseudonyms of team members and contact info (e.g., GitHub handle, email address, or other)",
      "c. Which Hackathon Build track(s) you are submitting your build to (please make sure to read the track details in order to ensure eligibility)",
    ],
  },
  {
    title: "2. Source Code Repository Link",
    items: [
      "a. Submit public & decentralized app repository on GitHub and link to the thirdweb Dashboard project",
      "b. Provide a detailed README and clear description of the game mechanics, an explanation of how thirdweb’s GamingKit and other required elements are used based on submission track, all mentioned in the Technologies Used section of README.",
      "c. Include a link to the working demo or provide a testing guide",
    ],
  },
  {
    title: "3. Showcase",
    items: [
      "a. Create a written/video breakdown of the project and tech stack used published to a dev forum like stackoverflow, dev.to or youtube, depending on what format you choose.",
      "b. Include a link to your project breakdown in your submission",
    ],
  },
  {
    title: "4. Miscellaneous",
    items: [
      "a. All eligible projects must be deployed to a testnet or mainnet and utilize thirdweb’s GamingKit, including the UnitySDK in some way shape or form (unless otherwise stated).",
      "b. All submissions must be open-source",
      "c. Must be created during the Hackathon",
      "d. Must be original IP",
      "e. In addition, they must adhere to all the above requirements and the specific asks of the track you’re submitting to. Please be sure to call these details in your submission as requested.",
      "f. If you have any questions, especially as it relates to the ‘Choose Your Own Adventure’ Bonus Track, don’t hesitate to reach out to the team.",
    ],
  },
];

const SubmissionRequirements: FC = () => {
  return (
    <Flex flexDir="column">
      <Heading>Submission Requirements</Heading>
      {requirements.map(({ items, title }) => (
        <>
          <Heading fontSize="20px" mt="6">
            {title}
          </Heading>
          <List mt="2">
            {items.map((item) => (
              <ListItem key={item}>{item}</ListItem>
            ))}
          </List>
        </>
      ))}
    </Flex>
  );
};
export default SubmissionRequirements;
