import { fetchIdea, updateIdea } from "@/api/ideas";
import InputBox from "@/components/inputs/InputBox";
import TextareaBox from "@/components/inputs/TextareaBox";
import {
  queryOptions,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const ideaQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["idea", id],
    queryFn: () => fetchIdea(id),
  });

export const Route = createFileRoute("/ideas/$ideaId/edit")({
  component: IdeaEditPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId));
  },
});

function IdeaEditPage() {
  const { ideaId } = Route.useParams();
  const navigate = useNavigate();

  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));

  const [formData, setFormData] = useState({
    title: idea.title,
    summary: idea.summary,
    description: idea.description,
    tagsInput: idea.tags.join(", "),
  });
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      updateIdea(ideaId, {
        createdAt: idea.createdAt,
        title: formData.title,
        summary: formData.summary,
        description: formData.description,
        tags: formData.tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      navigate({ to: "/ideas/$ideaId", params: { ideaId } });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync();
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Edit Idea</h1>
      <Link
        to="/ideas/$ideaId"
        params={{ ideaId }}
        className="text-sm text-blue-600 hover:underline"
      >
        Back to idea
      </Link>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputBox
          htmlFor="title"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleFormChange}
          placeholder="Enter idea title"
        />
        <InputBox
          htmlFor="summary"
          label="Summary"
          name="summary"
          value={formData.summary}
          onChange={handleFormChange}
          placeholder="Enter idea summary"
        />
        <TextareaBox
          htmlFor="body"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleFormChange}
          placeholder="Write out the description of your idea"
        />
        <InputBox
          htmlFor="tags"
          label="Tags"
          name="tagsInput"
          value={formData.tagsInput}
          onChange={handleFormChange}
          placeholder="Optional tags, comma separated"
        />

        <div className="mt-5">
          <button
            type="submit"
            disabled={isPending}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Updating..." : "Update Idea"}
          </button>
        </div>
      </form>
    </div>
  );
}
