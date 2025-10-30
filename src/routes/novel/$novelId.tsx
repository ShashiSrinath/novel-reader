import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/novel/$novelId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
