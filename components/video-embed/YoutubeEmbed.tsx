import { Box } from "@chakra-ui/react";

interface YoutubeEmbedProps {
  maxWidth: number;
  aspectRatio: number;
  videoId: string;
  title: string;
}

export const YoutubeEmbed: React.FC<YoutubeEmbedProps> = (props) => {
  return (
    <Box
      as="iframe"
      width={props.maxWidth}
      loading="lazy"
      src={`https://www.youtube-nocookie.com/embed/${props.videoId}`}
      title={props.title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      display="block"
      maxWidth="100%"
      aspectRatio={props.aspectRatio}
      border="none"
    />
  );
};
