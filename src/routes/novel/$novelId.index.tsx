import { createFileRoute, Link } from "@tanstack/react-router";
import { ListOrdered } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNovelChaptersById } from "@/server/get-novels.ts";

export const Route = createFileRoute("/novel/$novelId/")({
	component: RouteComponent,
	loader: async ({ params: { novelId } }) => {
		const chapterData = await getNovelChaptersById({ data: { id: novelId } });
		return { chapterData };
	},
});

function RouteComponent() {
	const { chapterData } = Route.useLoaderData();
	const { novelId } = Route.useParams();
	const chapterList = chapterData || [];

	return (
		<div className="container mx-auto py-10 px-4">
			<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-10 text-center">
				Chapters
			</h1>
			<div className="grid gap-6">
				{chapterList.length > 0 ? (
					chapterList.map((chapter) => (
						<Link
							to="/novel/$novelId/$chapterId"
							params={{ novelId, chapterId: chapter.Chapter }}
							key={chapter.Chapter}
						>
							<Card
								key={chapter.Chapter}
								className="hover:shadow-lg transition-shadow duration-300"
							>
								<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
									<CardTitle className="text-xl font-semibold leading-snug pr-4">
										Chapter {chapter.Chapter}
									</CardTitle>
									<ListOrdered className="h-6 w-6 text-primary" />
								</CardHeader>
								<CardContent className="space-y-3">
									<p className="text-lg font-medium">
										{chapter["Translated Title"]}
									</p>
								</CardContent>
							</Card>
						</Link>
					))
				) : (
					<div className="col-span-full text-center py-12">
						<p className="text-2xl text-muted-foreground">No chapters found.</p>
					</div>
				)}
			</div>
		</div>
	)
}
