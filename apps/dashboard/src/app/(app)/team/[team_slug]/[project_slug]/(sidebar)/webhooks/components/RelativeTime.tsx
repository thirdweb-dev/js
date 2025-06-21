"use client";
import { formatDistanceToNowStrict } from "date-fns";
import { useEffect, useState } from "react";

export function RelativeTime({
  date,
  className,
}: {
  date: string;
  className?: string;
}) {
  const [content, setContent] = useState(() => {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "-";
    try {
      return formatDistanceToNowStrict(parsedDate, { addSuffix: true });
    } catch {
      return "-";
    }
  });

  // eslint-disable-next-line
  useEffect(() => {
    const updateContent = () => {
      const parsedDate = new Date(date);
      if (Number.isNaN(parsedDate.getTime())) {
        setContent("-");
      } else {
        try {
          setContent(
            formatDistanceToNowStrict(parsedDate, { addSuffix: true }),
          );
        } catch {
          setContent("-");
        }
      }
    };
    updateContent();
    const interval = setInterval(updateContent, 10000);
    return () => clearInterval(interval);
  }, [date]);

  return <span className={className}>{content}</span>;
}
