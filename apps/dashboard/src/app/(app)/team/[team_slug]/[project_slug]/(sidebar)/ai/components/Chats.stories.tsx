import type { Meta, StoryObj } from "@storybook/nextjs";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { projectStub, randomLorem } from "@/storybook/stubs";
import { storybookThirdwebClient } from "@/storybook/utils";
import { type ChatMessage, Chats } from "./Chats";

const meta = {
  component: Variant,
  decorators: [
    (Story) => (
      <ThirdwebProvider>
        <div className="container flex max-w-[800px] flex-col gap-14 py-10">
          <div>
            <ConnectButton client={storybookThirdwebClient} />
          </div>
          <Story />
        </div>
      </ThirdwebProvider>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "AI/Chats",
} satisfies Meta<typeof Variant>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserPresenceError: Story = {
  args: {
    messages: [
      {
        content: [
          {
            text: randomLorem(10),
            type: "text",
          },
        ],
        type: "user",
      },
      {
        texts: [randomLorem(20)],
        type: "presence",
      },
      {
        text: randomLorem(20),
        type: "error",
      },
    ],
  },
};

export const SendTransaction: Story = {
  args: {
    messages: [
      {
        request_id: undefined,
        text: randomLorem(40),
        type: "assistant",
      },
      {
        data: {
          chain_id: 1,
          data: "0x",
          to: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
          value: "0x16345785d8a0000",
        },
        request_id: "xxxxx",
        subtype: "sign_transaction",
        type: "action",
      },
    ],
  },
};

export const WithAndWithoutRequestId: Story = {
  args: {
    messages: [
      {
        request_id: "xxxxx",
        text: randomLorem(40),
        type: "assistant",
      },
      {
        request_id: undefined,
        text: randomLorem(50),
        type: "assistant",
      },
    ],
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

export const Markdown: Story = {
  args: {
    messages: [
      {
        request_id: undefined,
        text: responseWithCodeMarkdown,
        type: "assistant",
      },
      {
        content: [
          {
            text: responseWithCodeMarkdown,
            type: "text",
          },
        ],
        type: "user",
      },
    ],
  },
};

function Variant(props: { messages: ChatMessage[] }) {
  return (
    <Chats
      project={projectStub("xxxxx", "team-1")}
      authToken="xxxxx"
      client={storybookThirdwebClient}
      enableAutoScroll={false}
      isChatStreaming={false}
      messages={props.messages}
      sendMessage={() => {}}
      sessionId="xxxxx"
      setEnableAutoScroll={() => {}}
    />
  );
}
