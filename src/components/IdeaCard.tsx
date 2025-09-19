import type { idea } from "@/types";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";

function IdeaCard({ idea, button = true }: { idea: idea; button?: boolean }) {
  const linkClasses = clsx({
    "text-blue-600 hover:underline mt-3": !button,
    "text-center mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition":
      button,
  });
  return (
    <div
      key={idea._id}
      className="border border-gray-300 p-4 rounded shadow bg-white flex flex-col justify-between"
    >
      <div className="">
        <h2 className="text-lg font-semibold">{idea.title}</h2>
        <p className="text-gray-700 mt-2">{idea.summary}</p>
      </div>

      <Link
        className={linkClasses}
        to="/ideas/$ideaId"
        params={{ ideaId: idea._id.toString() }}
      >
        {button ? "View Idea" : "Read More ➡"}
      </Link>
    </div>
  );
}

export default IdeaCard;
