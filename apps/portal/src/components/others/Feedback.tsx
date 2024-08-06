"use client";

import { Button } from "@/components/ui/button";
import { BadgeCheckIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import posthog from "posthog-js";

export function Feedback() {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const feedbackEvent = "Portal Feedback";
	const [feedback, setFeedback] = useState("");

	if (!isSubmitted) {
		return (
			<div className="flex flex-col gap-3 md:h-16 md:flex-row md:items-center md:gap-5">
				<p>Was this page helpful?</p>

				<div className="flex gap-3">
					<Button
						variant="outline"
						onClick={() => {
							setIsSubmitted(true);
							posthog.capture(feedbackEvent, {
								response: "yes",
							});
						}}
					>
						Yes
						<ThumbsUpIcon className="size-4 text-f-300" />
					</Button>

					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								onClick={() => {
									posthog.capture(feedbackEvent, {
										response: "no",
									});
								}}
							>
								No
								<ThumbsDownIcon className="size-4 text-f-300" />
							</Button>
						</DialogTrigger>

						<DialogContent className="p-5">
							<h3 className="mb-3 text-lg font-semibold text-f-100">
								Apologies for any confusion.
							</h3>
							<p className="mb-5 font-medium text-f-300">
								Please provide details about the issue you encountered to help
								us improve our documentation.
							</p>
							<textarea
								className="mb-2 h-32 w-full rounded-sm border bg-b-800  p-2 font-medium text-f-100 outline-none placeholder:font-semibold"
								value={feedback}
								placeholder="Your feedback..."
								onChange={(e) => {
									setFeedback(e.target.value);
								}}
							></textarea>
							<div className="mt-3 flex flex-row-reverse">
								<Button
									onClick={() => {
										setIsSubmitted(true);
										posthog.capture("Portal Feedback", {
											feedback: feedback,
										});
									}}
								>
									Submit
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		);
	}
	return (
		<div className="duration-500 animate-in fade-in-0">
			<div className="flex items-center gap-2 text-accent-500 md:h-16">
				<BadgeCheckIcon />
				<p className="font-semibold text-accent-500">
					Thank you for your feedback!
				</p>
			</div>
		</div>
	);
}
