import { skillsNames } from "@/api";

export const SkillRadar = ({
	skillLevels,
}: {
	skillLevels: {
		[key: string]: number;
	};
}) => {
	const displaySkills = skillsNames;
	const levels = displaySkills.map(
		(skill) => skillLevels[`${skill}_skill_level`] as number
	);

	return (
		<div className="relative w-48 h-48 mx-auto">
			<svg className="absolute inset-0 w-full h-full" viewBox="-10 -10 220 220">
				{[20, 40, 60, 80, 100].map((radius) => (
					<circle
						key={radius}
						cx="100"
						cy="100"
						r={radius}
						fill="none"
						stroke="rgb(34, 197, 94, 0.2)"
						strokeWidth="1"
					/>
				))}

				{displaySkills.map((_, i) => {
					const angle = i * 72 - 90;
					const radians = (angle * Math.PI) / 180;
					const level = levels[i]!;
					const x = 100 + level * Math.cos(radians);
					const y = 100 + level * Math.sin(radians);
					return (
						<line
							key={i}
							x1="100"
							y1="100"
							x2={x}
							y2={y}
							stroke="rgb(34, 197, 94, 0.4)"
							strokeWidth="1"
						/>
					);
				})}

				<polygon
					points={displaySkills
						.map((_, i) => {
							const angle = i * 72 - 90;
							const radians = (angle * Math.PI) / 180;
							const level = levels[i]!;
							const x = 100 + level * Math.cos(radians);
							const y = 100 + level * Math.sin(radians);
							return `${x},${y}`;
						})
						.join(" ")}
					fill="rgba(34, 197, 94, 0.2)"
					stroke="rgb(34, 197, 94)"
					strokeWidth="2"
				/>

				{displaySkills.map((_, i) => {
					const angle = i * 72 - 90;
					const radians = (angle * Math.PI) / 180;
					const level = levels[i]!;
					const x = 100 + level * Math.cos(radians);
					const y = 100 + level * Math.sin(radians);
					return <circle key={i} cx={x} cy={y} r="3" fill="rgb(34, 197, 94)" />;
				})}
			</svg>

			{displaySkills.map((skill, i) => {
				const angle = i * 72 - 90;
				const radians = (angle * Math.PI) / 180;
				const x = 100 + 110 * Math.cos(radians);
				const y = 100 + 110 * Math.sin(radians);

				return (
					<div
						key={skill}
						className="absolute text-xs font-mono text-green-400 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
						style={{ left: `${(x / 200) * 100}%`, top: `${(y / 200) * 100}%` }}
					>
						{skill}
					</div>
				);
			})}
		</div>
	);
};
