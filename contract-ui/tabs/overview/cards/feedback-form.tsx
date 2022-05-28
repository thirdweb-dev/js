import {
  FeedbackForm,
  FeedbackFormProps,
} from "components/feedback/feedback-form";
import { Card } from "tw-components";

export const FeedbackFormCard: React.FC<FeedbackFormProps> = ({ ...props }) => {
  return (
    <Card flexGrow={1}>
      <FeedbackForm {...props} />
    </Card>
  );
};
