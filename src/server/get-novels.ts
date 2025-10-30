import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { env } from "@/env.ts";

export interface Novel {
	Id: number;
	CreatedAt: string;
	UpdatedAt: string;
	Title: string;
	related_sheet_id: string;
}

export interface NovelsData {
	list: Novel[];
	pageInfo: {
		totalRows: number;
		page: number;
		pageSize: number;
		isFirstPage: boolean;
		isLastPage: boolean;
	};
}

export type NovelChapterListItem = {
	Chapter: string;
	"Translated Title": string;
};

export type NovelChapter = {
	Chapter: string;
	"Translated Title": string;
	"Translated Text (English)": string;
};

export const getNovels = createServerFn().handler(async () => {
	const response = await fetch(
		`${env.NOCO_API_PATH}/api/v2/tables/mzq1bl4ygwtwuk1/records`,
		{
			headers: {
				"xc-token": env.READER_TOKEN,
			},
		},
	);

	return (await response.json()) as NovelsData;
});

export const getNovelChaptersById = createServerFn()
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		const response = await fetch(
			`${env.NOCO_API_PATH}/api/v2/tables/${data.id}/records?fields=Chapter,Translated Title&where=(Status,eq,Translated)&limit=999999999`,
			{
				headers: {
					"xc-token": env.READER_TOKEN,
				},
			},
		);
		return (await response.json()).list as NovelChapterListItem[];
	});

export const getChapterById = createServerFn()
	.inputValidator(z.object({ novelId: z.string(), chapterId: z.string() }))
	.handler(async ({ data }) => {
		const response = await fetch(
			`${env.NOCO_API_PATH}/api/v2/tables/${data.novelId}/records?fields=Chapter,Translated Title,Translated Text (English)&where=(Chapter,eq,${data.chapterId})&limit=1`,
			{
				headers: {
					"xc-token": env.READER_TOKEN,
				},
			},
		);
		return (await response.json()).list[0] as NovelChapter;
	});
