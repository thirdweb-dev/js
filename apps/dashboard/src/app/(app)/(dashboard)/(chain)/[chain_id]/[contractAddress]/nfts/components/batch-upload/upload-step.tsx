import { useState } from "react";
import { DownloadableCode } from "@/components/blocks/code/downloadable-code";
import { DropZone } from "@/components/blocks/drop-zone/drop-zone";
import { InlineCode } from "@/components/ui/inline-code";
import { TabButtons } from "@/components/ui/tabs";

interface UploadStepProps {
  hasFailed: boolean;
  onDrop: (acceptedFiles: File[]) => void;
  reset: () => void;
}

export function UploadStep(props: UploadStepProps) {
  const [tab, setTab] = useState<"csv" | "json">("csv");

  return (
    <div className="container px-0 max-w-3xl">
      <h2 className="text-2xl font-semibold tracking-tight mb-4">
        Upload NFTs
      </h2>

      <DropZone
        className="w-full py-24"
        onDrop={props.onDrop}
        isError={props.hasFailed}
        title={props.hasFailed ? "Invalid files" : "Upload files"}
        description={
          props.hasFailed
            ? "Make sure the uploaded files follow the requirements mentioned below"
            : "Drag and drop the files or folder"
        }
        resetButton={{
          label: "Reset",
          onClick: props.reset,
        }}
        accept={undefined}
      />

      <div className="h-8" />

      <div className="w-full">
        <TabButtons
          tabs={[
            {
              isActive: tab === "csv",
              name: "CSV",
              onClick: () => setTab("csv"),
            },
            {
              isActive: tab === "json",
              name: "JSON",
              onClick: () => setTab("json"),
            },
          ]}
        />

        <div className="h-6" />

        <div className="space-y-8">
          <Section title="Uploading Files">
            <p>
              Make sure to drag and drop the {tab === "csv" ? "CSV" : "JSON"}{" "}
              and the assets at the same time or upload a folder with all the
              files in it.
            </p>

            <p>
              Asset names <em>must</em> be sequential 0,1,2,3...n.[extension].
              It doesn't matter at what number you begin. Example: 131.png,
              132.png etc.
            </p>

            <p>
              Images and other file types can be used in combination. They both
              have to follow the asset naming convention above. Example: 0.png
              and 0.mp4, 1.png and 1.glb etc.
            </p>
          </Section>

          <Section title={`${tab === "csv" ? "CSV" : "JSON"} File Format`}>
            <p>
              The {tab === "csv" ? "CSV" : "JSON"} file must have a{" "}
              <InlineCode code="name" /> {tab === "csv" ? "column" : "property"}
              , which defines the name of the NFT
            </p>

            <p>
              Other optional {tab === "csv" ? "columns" : "properties"} are{" "}
              <InlineCode code="description" />,{" "}
              <InlineCode code="background_color" />,{" "}
              <InlineCode code="external_url" />,{" "}
              <InlineCode code="animation_url" />,{" "}
              {tab === "json" && (
                <>
                  ,
                  <InlineCode code="attributes" />
                </>
              )}{" "}
              and <InlineCode code="supply" />
              {". "}
              {tab === "csv" &&
                "All other columns will be treated as Attributes. For example: See 'eyes', 'nose' below."}
            </p>

            <DownloadableCode
              code={tab === "csv" ? csv_example_basic : json_example_basic}
              fileNameWithExtension={
                tab === "csv" ? "example.csv" : "example.json"
              }
              lang={tab === "csv" ? "csv" : "json"}
            />
          </Section>

          <Section title="Map your assets to NFTs">
            <p>
              If you want to map your media files to your NFTs, you can add the
              name of your files to the <InlineCode code="image" /> and{" "}
              <InlineCode code="animation_url" />{" "}
              {tab === "csv" ? "columns" : "properties"}.{" "}
              <DownloadableCode
                code={
                  tab === "csv"
                    ? csv_with_image_number_example
                    : json_with_image_number_example
                }
                fileNameWithExtension={
                  tab === "csv"
                    ? "example-with-maps.csv"
                    : "example-with-maps.json"
                }
                lang={tab === "csv" ? "csv" : "json"}
              />
            </p>
          </Section>

          <Section title="Using asset links instead of uploading assets">
            <p>
              When uploading files, assets will be uploaded and pinned to IPFS
              automatically. If you already have the files uploaded elsewhere,
              you can specify the IPFS or HTTP(s) links in the{" "}
              <InlineCode code="image" /> and/or{" "}
              <InlineCode code="animation_url" />{" "}
              {tab === "csv" ? "columns" : "properties"}. instead of uploading
              the assets and just upload a single{" "}
              {tab === "csv" ? "CSV" : "JSON"} file.
              <DownloadableCode
                code={
                  tab === "csv"
                    ? csv_with_image_link_example
                    : json_with_image_link_example
                }
                fileNameWithExtension={
                  tab === "csv"
                    ? "example-with-ipfs.csv"
                    : "example-with-ipfs.json"
                }
                lang={tab === "csv" ? "csv" : "json"}
              />
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section(props: { title: string; children: React.ReactNode }) {
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
name,description,background_color,eyes,nose
Token 0 Name,Token 0 Description,#0098EE,red,green
Token 1 Name,Token 1 Description,#0098EE,blue,yellow`;

const json_example_basic = `\
[
  {
    "name": "Token 0 Name",
    "description": "Token 0 Description",
    "background_color": "#0098EE",
    "attributes": [
      {
        "trait_type": "eyes",
        "value": "red"
      },
      {
        "trait_type": "nose",
        "value": "green"
      }
    ]
  },
  {
    "name": "Token 1 Name",
    "description": "Token 1 Description",
    "background_color": "#0098EE",
    "attributes": [
      {
        "trait_type": "eyes",
        "value": "blue"
      },
      {
        "trait_type": "nose",
        "value": "yellow"
      }
    ]
  }
]`;

const csv_with_image_link_example = `\
name,description,image,animation_url,background_color,eyes,nose
Token 0 Name,Token 0 Description,ipfs://ipfsHash/0,ipfs://ipfsHash/0,#0098EE,red,green
Token 1 Name,Token 1 Description,ipfs://ipfsHash/1,ipfs://ipfsHash/1,#0098EE,blue,yellow`;

const json_with_image_link_example = `\
[
  {
    "name": "Token 0 Name",
    "description": "Token 0 Description",
    "image": "ipfs://ipfsHash/0",
    "animation_url": "ipfs://ipfsHash/0",
    "attributes": [
      {
        "trait_type": "eyes",
        "value": "red"
      },
      {
        "trait_type": "nose",
        "value": "green"
      }
    ]
  },
  {
    "name": "Token 1 Name",
    "description": "Token 1 Description",
    "image": "ipfs://ipfsHash/1",
    "animation_url": "ipfs://ipfsHash/1",
    "attributes": [
      {
        "trait_type": "eyes",
        "value": "blue"
      },
      {
        "trait_type": "nose",
        "value": "yellow"
      }
    ]
  }
]`;

const csv_with_image_number_example = `\
name,description,image,animation_url,background_color,eyes,nose
Token 0 Name,Token 0 Description,0.png,0.mp4,#0098EE,red,green
Token 1 Name,Token 1 Description,1.png,1.mp4,#0098EE,blue,yellow`;

const json_with_image_number_example = `\
[
  {
    "name": "Token 0 Name",
    "description": "Token 0 Description",
    "image": "0.png",
    "animation_url": "0.mp4",
    "attributes": [
      {
        "trait_type": "eyes",
        "value": "red"
      },
      {
        "trait_type": "nose",
        "value": "green"
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
        "trait_type": "eyes",
        "value": "blue"
      },
      {
        "trait_type": "nose",
        "value": "yellow"
      }
    ]
  }
]`;
