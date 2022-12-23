interface YoutubeEmbedProps {
  maxWidth: number;
  aspectRatio: number;
  videoId: string;
  title: string;
}

export const YoutubeEmbed: React.FC<YoutubeEmbedProps> = (props) => {
  return (
    <iframe
      width={props.maxWidth}
      loading="lazy"
      src={`https://www.youtube-nocookie.com/embed/${props.videoId}`}
      title={props.title}
      // eslint-disable-next-line react/forbid-dom-props
      style={{
        display: "block",
        maxWidth: "100%",
        aspectRatio: props.aspectRatio,
        border: "none",
      }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};
