import { CodeBlock, Tabs, TabsContent, TabsList, TabsTrigger } from "@doc";

export function IframeCodePreview(props: { src: string }) {
  const includesImage = props.src.includes("image=");
  const height = includesImage ? "850px" : "700px";
  return (
    <Tabs defaultValue="code">
      <TabsList>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="code">
        <CodeBlock
          code={`\
<iframe
  src="${props.src}"
  height="${height}"
  width="100%"
  style="border: 0;"
/>`}
          lang="html"
        />
      </TabsContent>
      <TabsContent value="preview">
        <iframe
          title="Buy widget iframe"
          src={props.src}
          height={height}
          className="rounded-xl"
          width="100%"
          style={{ border: 0 }}
        />
      </TabsContent>
    </Tabs>
  );
}
