"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BadgeCheckIcon } from "lucide-react";

export function Subscribe() {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [email, setEmail] = useState("");

	if (isSubmitted) {
		return (
			<p className="flex gap-2 text-base font-semibold text-accent-500 duration-500 animate-in fade-in-0 md:h-24 md:items-center">
				<BadgeCheckIcon />
				Thank you for subscribing!
			</p>
		);
	}
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				setIsSubmitted(true);

				try {
					await fetch("/api/email-signup", {
						method: "POST",
						body: JSON.stringify({ email }),
					});
				} catch (e) {
					console.debug("Error subscribing");
					console.error(e);
				}
			}}
			className="group"
		>
			<p className="mb-3 text-base font-semibold text-f-100">
				Subscribe for the latest dev updates
			</p>
			<div className="flex">
				<Input
					className="h-12 border border-b-600 bg-b-900 font-semibold duration-200 placeholder:font-semibold focus-visible:outline-none focus-visible:ring-offset-0 group-focus-within:border-f-100 md:w-[230px]"
					placeholder="Email"
					type="email"
					value={email}
					onChange={(e) => {
						setEmail(e.target.value);
					}}
					style={{
						borderTopRightRadius: 0,
						borderBottomRightRadius: 0,
					}}
				/>

				<Button
					type="submit"
					className="h-12 bg-b-600 font-semibold text-f-100 duration-200 group-focus-within:bg-f-100 group-focus-within:text-b-900"
					style={{
						borderTopLeftRadius: 0,
						borderBottomLeftRadius: 0,
					}}
				>
					Subscribe
				</Button>
			</div>
		</form>
	);
}
