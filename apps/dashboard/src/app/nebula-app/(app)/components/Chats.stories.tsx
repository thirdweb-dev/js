import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "sonner";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { accountStub, randomLorem } from "../../../../stories/stubs";
import { BadgeContainer, mobileViewport } from "../../../../stories/utils";
import { type ChatMessage, Chats } from "./Chats";

const meta = {
  title: "Nebula/Chats",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

const markdownExample = `\
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6


This a paragraph

This is another paragraph

This a very long paragraph lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec pur us. Donec euismod, nunc nec vehicula.
ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec pur us. Donec euismod, nunc nec vehicula.


## Empasis

*Italic text*
_Also italic text_

**Bold text**
__Also bold text__

***Bold and italic***
___Also bold and italic___

## Blockquote
> This is a blockquote.

## Lists

### Unordered list
- Item 1
- Item 2
  - Nested Item 1
  - Nested Item 2

### Ordered list
1. First item
2. Second item
   1. Sub-item 1
   2. Sub-item 2

### Mixed Nested lists

- Item 1
- Item 2
  1. Sub-item 1
  2. Sub-item 2


1. First item
2. Second item
   - Sub-item 1
   - Sub-item 2

### Code
This a a paragraph with some \`inlineCode()\`

This a \`const longerCodeSnippet = "Example. This should be able to handle line breaks as well, it should not be overflowing the page";\`

\`\`\`javascript
// Code block with syntax highlighting
function example() {
  console.log("Hello, world!");
}
\`\`\`

### Links
[thirdweb](https://www.thirdweb.com)

### Images
![Alt text](https://picsum.photos/2000/500)


### Horizontal Rule



---



### Tables
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | More Data|
| Row 2    | Data     | More Data|


| Column 1     | Column 2         | Column 3     | Column 4         | Column 5     |
|--------------|------------------|--------------|------------------|--------------|
| Row 1 Cell 1 | Row 1 Cell 2     | Row 1 Cell 3 | Row 1 Cell 4     | Row 1 Cell 5 |
| Row 2 Cell 1 | Row 2 Cell 2     | Row 2 Cell 3 | Row 2 Cell 4     | Row 2 Cell 5 |
| Row 3 Cell 1 | Row 3 Cell 2     | Row 3 Cell 3 | Row 3 Cell 4     | Row 3 Cell 5 |
| Row 4 Cell 1 | Row 4 Cell 2     | Row 4 Cell 3 | Row 4 Cell 4     | Row 4 Cell 5 |
| Row 5 Cell 1 | Row 5 Cell 2     | Row 5 Cell 3 | Row 5 Cell 4     | Row 5 Cell 5 |

`;

const responseWithCodeMarkdown = `
${randomLorem(20)}

${markdownExample}
`;

function Story() {
  return (
    <ThirdwebProvider>
      <div className="container flex max-w-[800px] flex-col gap-14 py-10">
        <div>
          <ConnectButton client={getThirdwebClient()} />
        </div>

        <Variant
          label="user + presence + error"
          messages={[
            {
              text: randomLorem(10),
              type: "user",
            },
            {
              text: randomLorem(20),
              type: "presence",
            },
            {
              text: randomLorem(20),
              type: "error",
            },
          ]}
        />

        <Variant
          label="send-transaction"
          messages={[
            {
              text: randomLorem(40),
              type: "assistant",
              request_id: undefined,
            },
            {
              type: "send_transaction",
              data: {
                chainId: 1,
                to: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
                data: "0x",
                value: "0x16345785d8a0000",
              },
            },
          ]}
        />

        <Variant
          label="invalid send-transaction"
          messages={[
            {
              text: randomLorem(40),
              type: "assistant",
              request_id: undefined,
            },
            {
              type: "send_transaction",
              data: null,
            },
          ]}
        />

        <BadgeContainer label="Assistant response With request_id, Without request_id">
          <Chats
            enableAutoScroll={false}
            setEnableAutoScroll={() => {}}
            client={getThirdwebClient()}
            authToken="xxxxx"
            isChatStreaming={false}
            sessionId="xxxxx"
            twAccount={accountStub()}
            messages={[
              {
                text: randomLorem(40),
                type: "assistant",
                request_id: "xxxxx",
              },
              {
                text: randomLorem(50),
                type: "assistant",
                request_id: undefined,
              },
            ]}
          />
        </BadgeContainer>

        <BadgeContainer label="Assistant markdown">
          <Chats
            enableAutoScroll={false}
            setEnableAutoScroll={() => {}}
            client={getThirdwebClient()}
            authToken="xxxxx"
            isChatStreaming={false}
            sessionId="xxxxx"
            twAccount={accountStub()}
            messages={[
              {
                text: responseWithCodeMarkdown,
                type: "assistant",
                request_id: undefined,
              },
              {
                text: responseWithCodeMarkdown,
                type: "user",
              },
            ]}
          />
        </BadgeContainer>

        <Toaster richColors />
      </div>
    </ThirdwebProvider>
  );
}

function Variant(props: {
  label: string;
  messages: ChatMessage[];
}) {
  return (
    <BadgeContainer label={props.label}>
      <Chats
        enableAutoScroll={false}
        setEnableAutoScroll={() => {}}
        client={getThirdwebClient()}
        authToken="xxxxx"
        isChatStreaming={false}
        sessionId="xxxxx"
        twAccount={accountStub()}
        messages={props.messages}
      />
    </BadgeContainer>
  );
}
