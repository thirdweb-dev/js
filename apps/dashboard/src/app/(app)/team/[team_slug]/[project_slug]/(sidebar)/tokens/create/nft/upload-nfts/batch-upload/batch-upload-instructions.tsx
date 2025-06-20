import { Button } from "@/components/ui/button";
import { CodeClient } from "@/components/ui/code/code.client";
import { InlineCode } from "@/components/ui/inline-code";
import { TabButtons } from "@/components/ui/tabs";
import { ArrowDownToLineIcon } from "lucide-react";
import { useState } from "react";
import { handleDownload } from "../../../_common/download-file-button";

export function BatchUploadInstructions() {
  const [tab, setTab] = useState<"csv" | "json">("csv");
  return (
    <div className="w-full">
      <TabButtons
        tabs={[
          {
            name: "CSV",
            onClick: () => setTab("csv"),
            isActive: tab === "csv",
          },
          {
            name: "JSON",
            onClick: () => setTab("json"),
            isActive: tab === "json",
          },
        ]}
      />

      <div className="h-6" />

      <div className="space-y-8">
        <Section title="Uploading Files">
          <p>
            Make sure to drag and drop the {tab === "csv" ? "CSV" : "JSON"} and
            the assets at the same time or upload a folder with all the files in
            it.
          </p>

          <p>
            Asset names <em>must</em> be sequential 0,1,2,3...n.[extension]. It
            doesn&apos;t matter at what number you begin. Example: 131.png,
            132.png etc.
          </p>

          <p>
            Images and other file types can be used in combination. They both
            have to follow the asset naming convention above. Example: 0.png and
            0.mp4, 1.png and 1.glb etc.
          </p>
        </Section>

        <Section title={`${tab === "csv" ? "CSV" : "JSON"} File Format`}>
          <p>
            The {tab === "csv" ? "CSV" : "JSON"} file must have a{" "}
            <InlineCode code="name" /> {tab === "csv" ? "column" : "property"},
            which defines the name of the NFT
          </p>

          <p>
            Other optional {tab === "csv" ? "columns" : "properties"} are{" "}
            <InlineCode code="description" />,{" "}
            <InlineCode code="background_color" />,{" "}
            <InlineCode code="external_url" />,{" "}
            <InlineCode code="animation_url" />,{" "}
            <InlineCode code="price_amount" />,{" "}
            <InlineCode code="price_currency" />{" "}
            {tab === "json" && (
              <>
                ,
                <InlineCode code="attributes" />
              </>
            )}{" "}
            and <InlineCode code="supply" />
            {". "}
            {tab === "csv" &&
              "All other columns will be treated as Attributes. For example: See 'foo', 'bar' and 'bazz' below."}
          </p>

          <ExampleCode
            code={tab === "csv" ? csv_example_basic : json_example_basic}
            lang={tab === "csv" ? "csv" : "json"}
            fileNameWithExtension={
              tab === "csv" ? "example.csv" : "example.json"
            }
          />
        </Section>

        <Section title="Map your assets to NFTs">
          <p>
            If you want to map your media files to your NFTs, you can add the
            name of your files to the <InlineCode code="image" /> and{" "}
            <InlineCode code="animation_url" />{" "}
            {tab === "csv" ? "columns" : "properties"}.{" "}
            <ExampleCode
              code={
                tab === "csv"
                  ? csv_with_image_number_example
                  : json_with_image_number_example
              }
              lang={tab === "csv" ? "csv" : "json"}
              fileNameWithExtension={
                tab === "csv"
                  ? "example-with-maps.csv"
                  : "example-with-maps.json"
              }
            />
          </p>
        </Section>

        <Section title="Using asset links instead of uploading assets">
          <p>
            When uploading files, assets will be uploaded and pinned to IPFS
            automatically. If you already have the files uploaded elsewhere, you
            can specify the IPFS or HTTP(s) links in the{" "}
            <InlineCode code="image" /> and/or{" "}
            <InlineCode code="animation_url" />{" "}
            {tab === "csv" ? "columns" : "properties"}. instead of uploading the
            assets and just upload a single {tab === "csv" ? "CSV" : "JSON"}{" "}
            file.
            <ExampleCode
              code={
                tab === "csv"
                  ? csv_with_image_link_example
                  : json_with_image_link_example
              }
              lang={tab === "csv" ? "csv" : "json"}
              fileNameWithExtension={
                tab === "csv"
                  ? "example-with-ipfs.csv"
                  : "example-with-ipfs.json"
              }
            />
          </p>
        </Section>

        <Section title="Set price and supply">
          <p>
            You can also add <InlineCode code="price_amount" />,{" "}
            <InlineCode code="price_currency" /> and{" "}
            <InlineCode code="supply" />{" "}
            {tab === "csv" ? "columns" : "properties"} to set the price and
            supply of the NFT. If you don't specify it in{" "}
            {tab === "csv" ? "CSV" : "JSON"} file, you will be prompted to set
            it in the next step. To set the price in native token, leave the the{" "}
            <InlineCode code="price_currency" />{" "}
            {tab === "csv" ? "column" : "property"} empty. To set the price in
            ERC20 token - specify the token address in the{" "}
            <InlineCode code="price_currency" /> column.{" "}
            <ExampleCode
              code={
                tab === "csv"
                  ? csv_example_price_supply
                  : json_example_price_supply
              }
              lang={tab === "csv" ? "csv" : "json"}
              fileNameWithExtension={
                tab === "csv"
                  ? "example-with-price-supply.csv"
                  : "example-with-price-supply.json"
              }
            />
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section(props: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-1 font-medium text-base text-foreground">
        {props.title}
      </h2>
      <div className="space-y-1.5 text-muted-foreground leading-relaxed">
        {props.children}
      </div>
    </section>
  );
}

const csv_example_basic = `\
name,description,background_color,foo,bar,bazz
Token 0 Name,Token 0 Description,#0098EE,value1,value2,value3
Token 1 Name,Token 1 Description,#0098EE,value1,value2,value3
`;

const csv_example_price_supply = `\
name,description,background_color,foo,bar,bazz,price_amount,price_currency,supply
Token 0 Name,Token 0 Description,#0098EE,value1,value2,value3,0.1,,1
Token 1 Name,Token 1 Description,#0098EE,value1,value2,value3,0.2,0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48,10
`;

const json_example_basic = `\
[
  {
    "name": "Token 0 Name",
    "description": "Token 0 Description",
    "background_color": "#0098EE",
    "attributes": [
      {
        "trait_type": "foo",
        "value": "value1"
      },
      {
        "trait_type": "bar",
        "value": "value2"
      },
      {
        "trait_type": "bazz",
        "value": "value3"
      }
    ]
  },
  {
    "name": "Token 1 Name",
    "description": "Token 1 Description",
    "background_color": "#0098EE",
    "attributes": [
      {
        "trait_type": "foo",
        "value": "value1"
      },
      {
        "trait_type": "bar",
        "value": "value2"
      },
      {
        "trait_type": "bazz",
        "value": "value3"
      }
    ]
  }
]
`;

const json_example_price_supply = `\
[
  {
    "name": "Token 0 Name",
    "description": "Token 0 Description",
    "price_amount": 0.1,
    "price_currency": "",
    "supply": 1,
    "attributes": [
      {
        "trait_type": "foo",
        "value": "value1"
      },
      {
        "trait_type": "bar",
        "value": "value2"
      },
      {
        "trait_type": "bazz",
        "value": "value3"
      }
    ]
  },
  {
    "name": "Token 1 Name",
    "description": "Token 1 Description",
    "price_amount": 0.2,
    "price_currency": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "supply": 10,
    "attributes": [
      {
        "trait_type": "foo",
        "value": "value1"
      },
      {
        "trait_type": "bar",
        "value": "value2"
      },
      {
        "trait_type": "bazz",
        "value": "value3"
      }
    ]
  }
]
`;

const csv_with_image_link_example = `\
name,description,image,animation_url,background_color,foo,bar,bazz
Token 0 Name,Token 0 Description,ipfs://ipfsHash/0,ipfs://ipfsHash/0,#0098EE,value1,value2,value3
Token 1 Name,Token 1 Description,ipfs://ipfsHash/0,ipfs://ipfsHash/0,#0098EE,value1,value2,value3
`;

const json_with_image_link_example = `\
[
  {
    "name": "Token 0 Name",
    "description": "Token 0 Description",
    "image": "ipfs://ipfsHash/0",
    "animation_url": "ipfs://ipfsHash/0",
    "attributes": [
      {
        "trait_type": "foo",
        "value": "value1"
      },
      {
        "trait_type": "bar",
        "value": "value2"
      },
      {
        "trait_type": "bazz",
        "value": "value3"
      }
    ]
  },
  {
    "name": "Token 1 Name",
    "description": "Token 1 Description",
    "image": "ipfs://ipfsHash/0",
    "animation_url": "ipfs://ipfsHash/0",
    "attributes": [
      {
        "trait_type": "foo",
        "value": "value1"
      },
      {
        "trait_type": "bar",
        "value": "value2"
      },
      {
        "trait_type": "bazz",
        "value": "value3"
      }
    ]
  }
]
`;

const csv_with_image_number_example = `\
name,description,image,animation_url,background_color,foo,bar,bazz
Token 0 Name,Token 0 Description,0.png,0.mp4,#0098EE,value1,value2,value3
Token 1 Name,Token 1 Description,1.png,1.mp4,#0098EE,value1,value2,value3
`;

const json_with_image_number_example = `\
[
  {
    "name": "Token 0 Name",
    "description": "Token 0 Description",
    "image": "0.png",
    "animation_url": "0.mp4",
    "attributes": [
      {
        "trait_type": "foo",
        "value": "value1"
      },
      {
        "trait_type": "bar",
        "value": "value2"
      },
      {
        "trait_type": "bazz",
        "value": "value3"
      }
    ]
  },
  {
    "name": "Token 1 Name",
    "description": "Token 1 Description",
    "image": "1.png",
    "animation_url": "1.mp4",
    "attributes": [
      {
        "trait_type": "foo",
        "value": "value1"
      },
      {
        "trait_type": "bar",
        "value": "value2"
      },
      {
        "trait_type": "bazz",
        "value": "value3"
      }
    ]
  }
]
`;

function ExampleCode(props: {
  code: string;
  lang: "csv" | "json";
  fileNameWithExtension: string;
}) {
  return (
    <div className="!my-3 relative">
      <CodeClient
        code={props.code}
        lang={props.lang}
        scrollableClassName="max-h-[300px] bg-background"
      />

      <Button
        variant="outline"
        size="sm"
        className="absolute top-3.5 right-14 mt-[1px] h-auto bg-background p-2"
        onClick={() => {
          handleDownload({
            fileContent: props.code,
            fileNameWithExtension: props.fileNameWithExtension,
            fileFormat: props.lang === "csv" ? "text/csv" : "application/json",
          });
        }}
      >
        <ArrowDownToLineIcon className="size-3" />
      </Button>
    </div>
  );
}
