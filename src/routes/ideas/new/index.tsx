import { createIdea } from "@/api/ideas";
import InputBox from "@/components/inputs/InputBox";
import TextareaBox from "@/components/inputs/TextareaBox";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/ideas/new/")({
  component: NewIdeaPage,
});

function NewIdeaPage() {
  const navigate = useNavigate();

  const initialFormData = {
    title: "",
    summary: "",
    description: "",
    tags: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      navigate({ to: "/ideas" });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.summary.trim() ||
      !formData.description.trim()
    ) {
      alert("Please fill up all form fields");
      return;
    }

    try {
      await mutateAsync({
        title: formData.title,
        summary: formData.summary,
        description: formData.description,
        tags: formData.tags
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Create New Idea</h1>
      <Link to="/ideas" className="text-sm text-blue-600 hover:underline">
        Back to ideas
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
          name="tags"
          value={formData.tags}
          onChange={handleFormChange}
          placeholder="Optional tags, comma separated"
        />

        <div className="mt-5">
          <button
            type="submit"
            disabled={isPending}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Creating Idea..." : "Create Idea"}
          </button>
        </div>
      </form>
    </div>
  );
}
