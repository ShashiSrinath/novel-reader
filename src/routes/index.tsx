import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNovels } from "@/server/get-novels.ts";

export const Route = createFileRoute("/")({
	component: App,
	loader: async () => {
		const novels = await getNovels();
		return { novels };
	},
});

function App() {
	const { novels } = Route.useLoaderData();
	const novelList = novels.list || [];

	return (
		<div className="container mx-auto py-10 px-4">
			<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-10 text-center">
				List of Novels
			</h1>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{novelList.length > 0 ? (
					novelList.map((novel) => (
						<Link
							to="/novel/$novelId"
							params={{ novelId: novel.related_sheet_id }}
							key={novel.Id}
						>
							<Card
								key={novel.Id}
								className="hover:shadow-lg transition-shadow duration-300"
							>
								<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
									<CardTitle className="text-xl font-semibold leading-snug pr-4">
										{novel.Title}
									</CardTitle>
									<BookOpen className="h-6 w-6 text-primary" />
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex flex-wrap gap-2">
										<Badge variant="secondary">ID: {novel.Id}</Badge>
										<Badge variant="outline">
											Sheet: {novel.related_sheet_id}
										</Badge>
									</div>
									<div className="text-sm text-muted-foreground pt-2">
										<p>
											Created:{" "}
											<span className="font-medium text-foreground">
												{new Date(novel.CreatedAt).toLocaleDateString()}
											</span>
										</p>
										<p>
											Updated:{" "}
											<span className="font-medium text-foreground">
												{new Date(novel.UpdatedAt).toLocaleDateString()}
											</span>
										</p>
									</div>
								</CardContent>
							</Card>
						</Link>
					))
				) : (
					<div className="col-span-full text-center py-12">
						<p className="text-2xl text-muted-foreground">No novels found.</p>
					</div>
				)}
			</div>
			{/* Optional: Displaying page info in a small footer */}
			<div className="mt-12 text-center text-sm text-muted-foreground">
				<p>Total Rows: {novels.pageInfo.totalRows}</p>
				<p>
					Page {novels.pageInfo.page} of{" "}
					{Math.ceil(novels.pageInfo.totalRows / novels.pageInfo.pageSize)}
				</p>
			</div>
		</div>
	);
}
