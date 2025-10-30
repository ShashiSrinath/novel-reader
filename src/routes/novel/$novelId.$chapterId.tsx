import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Settings } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { getChapterById } from "@/server/get-novels.ts";

export const Route = createFileRoute("/novel/$novelId/$chapterId")({
	component: RouteComponent,
	loader: async ({ params: { novelId, chapterId } }) => {
		const chapterData = await getChapterById({ data: { novelId, chapterId } });
		return { chapterData };
	},
});

const FONT_FAMILY_STYLES: Record<string, string> = {
	inter: "'Inter', sans-serif",
	bookerly: "'Bookerly', serif",
};

const LINE_HEIGHT_STYLES: Record<string, number> = {
	tight: 1.2,
	normal: 1.5,
	relaxed: 1.75,
};

const LETTER_SPACING_STYLES: Record<string, string> = {
	tight: "-0.025em",
	normal: "0em",
	wide: "0.05em",
};

const FONT_SIZE_RANGE = {
	min: 14,
	max: 32,
	step: 1,
};

const DEFAULT_SETTINGS = {
	fontSize: 18,
	fontFamily: "inter",
	lineHeight: "relaxed",
	letterSpacing: "normal",
};

const STORAGE_KEY = "novelReadingSettings";

function useReadingSettings() {
	const [settings, setSettings] = useState(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
		} catch (error) {
			console.error("Error reading reading settings from localStorage", error);
			return DEFAULT_SETTINGS;
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
		} catch (error) {
			console.error("Error saving reading settings to localStorage", error);
		}
	}, [settings]);

	const updateSetting = useCallback(
		(key: keyof typeof DEFAULT_SETTINGS, value: string | number) => {
			setSettings((prev: any) => ({ ...prev, [key]: value }));
		},
		[],
	);

	return { settings, updateSetting };
}

function RouteComponent() {
	const { chapterData } = Route.useLoaderData();
	const { novelId, chapterId } = Route.useParams();
	const { settings, updateSetting } = useReadingSettings();
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: need to scroll to top on chapter change
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [chapterId]);

	const title =
		chapterData["Translated Title"] || `Chapter ${chapterData["Chapter"]}`;
	const rawText = chapterData["Translated Text (English)"] || "";

	// Split the text by one or more newlines to create paragraphs
	const paragraphs = rawText.split(/\n+|\\n+/).filter((p) => p.trim() !== "");

	// biome-ignore lint/correctness/noNestedComponentDefinitions: Component is small and only used here
	const ReadingSettings = () => (
		<div className="p-4 border rounded-lg shadow-md mb-6 bg-white dark:bg-gray-800">
			<h3 className="text-xl font-semibold mb-4">Reading Settings</h3>

			{/* Font Size Selector */}
			<div className="mb-6">
				<p className="font-medium mb-2">Font Size ({settings.fontSize}px)</p>
				<div className="flex items-center space-x-4">
					<Slider
						min={FONT_SIZE_RANGE.min}
						max={FONT_SIZE_RANGE.max}
						step={FONT_SIZE_RANGE.step}
						value={[settings.fontSize as number]}
						onValueChange={([value]) => updateSetting("fontSize", value)}
						className="w-full"
					/>
					<Input
						type="number"
						min={FONT_SIZE_RANGE.min}
						max={FONT_SIZE_RANGE.max}
						value={settings.fontSize}
						onChange={(e) => {
							const value = parseInt(e.target.value);
							if (
								!isNaN(value) &&
								value >= FONT_SIZE_RANGE.min &&
								value <= FONT_SIZE_RANGE.max
							) {
								updateSetting("fontSize", value);
							}
						}}
						className="w-20"
					/>
				</div>
			</div>

			{/* Line Spacing Selector */}
			<div className="mb-6">
				<p className="font-medium mb-2">Line Spacing</p>
				<div className="flex space-x-2">
					{Object.keys(LINE_HEIGHT_STYLES).map((key) => (
						<Button
							key={key}
							variant={settings.lineHeight === key ? "default" : "outline"}
							onClick={() => updateSetting("lineHeight", key)}
							className="capitalize"
						>
							{key}
						</Button>
					))}
				</div>
			</div>

			{/* Letter Spacing Selector */}
			<div className="mb-6">
				<p className="font-medium mb-2">Letter Spacing</p>
				<div className="flex space-x-2">
					{Object.keys(LETTER_SPACING_STYLES).map((key) => (
						<Button
							key={key}
							variant={settings.letterSpacing === key ? "default" : "outline"}
							onClick={() => updateSetting("letterSpacing", key)}
							className="capitalize"
						>
							{key}
						</Button>
					))}
				</div>
			</div>

			{/* Font Family Selector */}
			<div>
				<p className="font-medium mb-2">Font Family</p>
				<div className="flex space-x-2">
					{Object.keys(FONT_FAMILY_STYLES).map((fontKey) => (
						<Button
							key={fontKey}
							variant={settings.fontFamily === fontKey ? "default" : "outline"}
							onClick={() => updateSetting("fontFamily", fontKey)}
							className="capitalize"
							style={{ fontFamily: FONT_FAMILY_STYLES[fontKey] }}
						>
							{fontKey}
						</Button>
					))}
				</div>
			</div>
		</div>
	);

	// biome-ignore lint/correctness/noNestedComponentDefinitions: Component is small and only used here
	const NavButtons = () => {
		const currentChapterNumber = parseInt(chapterId);
		const prevChapterId = (currentChapterNumber - 1).toString();
		const nextChapterId = (currentChapterNumber + 1).toString();

		const isFirstChapter = currentChapterNumber <= 1;

		return (
			<div className="flex justify-between my-6">
				<Button
					asChild
					variant="outline"
					disabled={isFirstChapter}
					className={isFirstChapter ? "pointer-events-none" : ""}
				>
					<Link
						to="/novel/$novelId/$chapterId"
						params={{ novelId, chapterId: prevChapterId }}
						aria-disabled={isFirstChapter}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Previous Chapter
					</Link>
				</Button>
				<Button asChild>
					<Link
						to="/novel/$novelId/$chapterId"
						params={{ novelId, chapterId: nextChapterId }}
					>
						Next Chapter
						<ArrowRight className="ml-2 h-4 w-4" />
					</Link>
				</Button>
			</div>
		);
	};

	const contentStyle = {
		fontSize: `${settings.fontSize}px`,
		lineHeight:
			LINE_HEIGHT_STYLES[
				settings.lineHeight as keyof typeof LINE_HEIGHT_STYLES
			],
		letterSpacing:
			LETTER_SPACING_STYLES[
				settings.letterSpacing as keyof typeof LETTER_SPACING_STYLES
			],
		fontFamily:
			FONT_FAMILY_STYLES[
				settings.fontFamily as keyof typeof FONT_FAMILY_STYLES
			],
	};

	return (
		<div className="max-w-3xl mx-auto p-4">
			<div className="flex justify-end pt-4">
				<Button
					variant="outline"
					size="icon"
					onClick={() => setIsSettingsOpen(!isSettingsOpen)}
					aria-label="Toggle reading settings"
				>
					<Settings className="h-4 w-4" />
				</Button>
			</div>
			{isSettingsOpen && <ReadingSettings />}
			<NavButtons />
			<h1 className="text-3xl font-bold mb-6 text-center">
				{chapterId} {title}
			</h1>
			<div className="space-y-4" style={contentStyle}>
				{paragraphs.map((paragraph) => (
					<p key={paragraph}>{paragraph}</p>
				))}
			</div>
			<NavButtons />
		</div>
	);
}
