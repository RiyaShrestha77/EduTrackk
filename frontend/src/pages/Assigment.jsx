import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { deleteAssignmentApi, getAssignmentsApi } from "../services/api";

const Assignment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetchAssignments();
    } else {
      setLoading(false);
    }
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data } = await getAssignmentsApi(courseId);
      setAssignments(data?.assignments || []);
    } catch (_err) {
      toast.error("Error loading assignments");
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assignmentId) => {
    const confirmed = window.confirm("Delete this assignment?");
    if (!confirmed) return;

    try {
      setDeletingId(assignmentId);
      await deleteAssignmentApi(assignmentId);
      toast.success("Assignment deleted");
      setAssignments((prev) => prev.filter((a) => a.assignment_id !== assignmentId));
    } catch (_err) {
      toast.error("Failed to delete assignment");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
            <h2 className="font-bold text-slate-800">Instructor Panel</h2>
            <Link to="/teacherdashboard" className="block text-sm text-slate-600 hover:text-black">
              Teacher Dashboard
            </Link>
            <Link to="/profile" className="block text-sm text-slate-600 hover:text-black">
              Profile
            </Link>
            <Link to="/" className="block text-sm text-slate-600 hover:text-black">
              Home
            </Link>
          </div>
        </aside>

        <main className="md:col-span-3">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Assignments</h1>
              <p className="text-slate-500 mt-1">Manage tasks and deadlines for this course</p>
            </div>

            <button
              onClick={() => navigate(`/createassignment/${courseId}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
            >
              + New Assignment
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : assignments.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium text-lg">No assignments found for this course.</p>
            </div>
          ) : (
            <div className="grid gap-5">
              {assignments.map((a) => (
                <div
                  key={a.assignment_id}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{a.title}</h3>
                    <p className="text-slate-500 mb-4 max-w-2xl">{a.description || "No description"}</p>
                    <div className="inline-flex items-center gap-2 text-rose-500 bg-rose-50 px-4 py-1.5 rounded-full text-sm font-bold">
                      Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : "Not set"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/createassignment/${courseId}/${a.assignment_id}`)}
                      className="px-4 py-2 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.assignment_id)}
                      disabled={deletingId === a.assignment_id}
                      className="px-4 py-2 text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-60"
                    >
                      {deletingId === a.assignment_id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Assignment;
