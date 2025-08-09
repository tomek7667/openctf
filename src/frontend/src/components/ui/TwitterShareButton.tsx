"use client";

import { Twitter } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";

interface TwitterShareButtonProps {
	contestName: string;
	teamName: string;
	place: number;
	isCaptain?: boolean;
}

export function TwitterShareButton({ 
	contestName, 
	teamName, 
	place, 
	isCaptain = false 
}: TwitterShareButtonProps) {
	const handleTweet = () => {
		const baseText = isCaptain 
			? `My team ${teamName} placed #${place} in ${contestName}! 🏆`
			: `We placed #${place} in ${contestName} with team ${teamName}! 🏆`;
		
		const openctfPromo = "\n\nPowered by OpenCTF - the open source CTF platform";
		const hashtags = "CTF,cybersecurity,hacking,OpenCTF";
		const openctfUrl = "https://openctf.org";
		
		const fullText = `${baseText}${openctfPromo}\n\n${openctfUrl}\n\n#${hashtags}`;
		const tweetText = encodeURIComponent(fullText);
		const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
		
		window.open(tweetUrl, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes');
	};

	return (
		<Button
			onClick={handleTweet}
			className="font-mono bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-blue-400 border border-blue-500/50 hover:border-cyan-400 transition-all duration-200 text-xs px-3 py-1.5 shadow-lg hover:shadow-blue-500/25"
		>
			<Twitter className="h-3 w-3 mr-1" />
			TWEET
		</Button>
	);
}