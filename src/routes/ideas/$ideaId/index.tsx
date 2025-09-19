import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  queryOptions,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { deleteIdea, fetchIdea } from "@/api/ideas";
import { useAuth } from "@/context/AuthContext";

/*
const fetchIdea = async (ideaId: string) => {
  const res = await fetch(`/api/ideas/${ideaId}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export const Route = createFileRoute("/ideas/$ideaId/")({
  component: IdeaDetailsPage,
  loader: async ({ params }) => {
    return fetchIdea(params.ideaId);
  },
});

function IdeaDetailsPage() {
  const idea = Route.useLoaderData();
  return <div>Hello {idea.title}</div>;
}
*/

/*
const fetchIdea = async (ideaId: string): Promise<idea> => {
  const res = await fetch(`/api/ideas/${ideaId}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};
*/

const ideaQueryOptions = (ideaId: string) =>
  queryOptions({
    queryKey: ["idea", ideaId],
    queryFn: () => fetchIdea(ideaId),
  });

export const Route = createFileRoute("/ideas/$ideaId/")({
  component: IdeaDetailsPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId));
  },
});

function IdeaDetailsPage() {
  const { ideaId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));

  const navigate = useNavigate();
  const { mutateAsync: deleteMutate, isPending } = useMutation({
    mutationFn: () => deleteIdea(ideaId),
    onSuccess: () => {
      navigate({ to: "/ideas" });
    },
  });

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this idea?"
    );

    if (confirmDelete) {
      await deleteMutate();
    }
  };

  const { user } = useAuth();
  return (
    <div className="p-4">
      <Link to="/ideas" className="text-blue-500 underline block mb-4">
        Back to ideas
      </Link>
      <h2 className="text-2xl font-bold">{idea.title}</h2>
      <p className="mt-2">{idea.description}</p>
      {user && user.id === idea.user && (
        <>
          {" "}
          <Link
            to="/ideas/$ideaId/edit"
            params={{ ideaId }}
            className="inline-block text-sm bg-yellow-500 hover:bg-yellow-600 text-white mt-4 mr-2 px-4 py-2 rounded transition cursor-pointer"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-sm bg-red-600 text-white mt-4 px-4 py-2 rounded transition cursor-pointer hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </>
      )}
    </div>
  );
}
