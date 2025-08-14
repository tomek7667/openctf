import Image, { ImageProps } from "next/image";
import { Globe } from "./icons";

const getFlagUrl = (countryCode: string) =>
	`https://flagcdn.com/w20/${countryCode.toLowerCase()}.webp`;

export const Flag = ({
	code,
	props,
}: {
	code: string;
	props?: Omit<ImageProps, "src" | "alt">;
}) => {
	if (code === "GLOBAL") {
		return <Globe size={props?.width ?? 20} className={props?.className} />;
	}
	return (
		<Image
			style={{ verticalAlign: "middle" }}
			{...props}
			src={getFlagUrl(code)}
			alt={`Flag of ${code}`}
		/>
	);
};
