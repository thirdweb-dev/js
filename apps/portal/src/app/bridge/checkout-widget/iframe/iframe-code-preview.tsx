import { CodeBlock, Tabs, TabsContent, TabsList, TabsTrigger } from "@doc";

export function IframeCodePreview(props: { src: string }) {
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
  height="700px"
  width="100%"
  style="border: 0;"
/>`}
          lang="html"
        />
      </TabsContent>
      <TabsContent value="preview">
        <iframe
          title="Checkout widget iframe"
          src={props.src}
          height="700px"
          className="rounded-xl"
          width="100%"
          style={{ border: 0 }}
        />
      </TabsContent>
    </Tabs>
  );
}
