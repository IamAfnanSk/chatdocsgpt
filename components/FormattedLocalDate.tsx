"use client";

const FormattedLocalDate: React.FC<{
  timestamp: number;
}> = ({ timestamp }) => {
  const formattedDateString = new Date(timestamp).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "long",
  });

  return <span>{formattedDateString}</span>;
};

export { FormattedLocalDate };
