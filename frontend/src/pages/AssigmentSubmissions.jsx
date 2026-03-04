import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getSubmissionsByAssignmentApi, updateGradeApi } from "../services/api";

const AssignmentSubmissions = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [drafts, setDrafts] = useState({});

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data } = await getSubmissionsByAssignmentApi(assignmentId);

      const list = data?.submissions || [];
      setSubmissions(list);

      const initialDrafts = {};
      list.forEach((sub) => {
        initialDrafts[sub.submission_id] = {
          grade: sub.grade || "",
          feedback: sub.feedback || "",
        };
      });
      setDrafts(initialDrafts);
    } catch (_err) {
      toast.error("Error loading submissions");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions();
    } else {
      setLoading(false);
    }
  }, [assignmentId]);

  const handleDraftChange = (submissionId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [submissionId]: {
        ...(prev[submissionId] || { grade: "", feedback: "" }),
        [field]: value,
      },
    }));
  };

  const handleGradeSubmit = async (submissionId) => {
    const payload = drafts[submissionId] || { grade: "", feedback: "" };

    try {
      setSavingId(submissionId);
      const { data } = await updateGradeApi(submissionId, payload);
      if (data?.success) {
        toast.success("Grade updated successfully");
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.submission_id === submissionId
              ? { ...sub, grade: payload.grade, feedback: payload.feedback }
              : sub
          )
        );
      } else {
        toast.error("Failed to update grade");
      }
    } catch (_err) {
      toast.error("Failed to update grade");
    } finally {
      setSavingId(null);
    }
  };

  const totalSubmissions = useMemo(() => submissions.length, [submissions.length]);

  if (loading) {
    return <div className="p-10 text-center font-bold">Loading submissions...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-black">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold transition-all"
          >
            <span className="text-xl">{'<-'}</span> Back
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Grading Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">
            Assignment #{assignmentId} | Total submissions: {totalSubmissions}
          </p>
        </div>

        <div className="space-y-6">
          {submissions.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
              <p className="text-slate-400 font-medium">
                No students have submitted work for this assignment yet.
              </p>
            </div>
          ) : (
            submissions.map((sub) => {
              const draft = drafts[sub.submission_id] || { grade: "", feedback: "" };

              return (
                <div
                  key={sub.submission_id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-slate-800">{sub.student?.username || "Student"}</h4>
                      <p className="text-xs text-slate-400">{sub.student?.email || "No email"}</p>
                    </div>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">
                      ID: {sub.submission_id}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                    <p className="text-xs font-bold text-indigo-500 uppercase mb-2">Student Submission</p>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">{sub.content || "No content"}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 mb-1">GRADE</label>
                      <input
                        type="text"
                        value={draft.grade}
                        placeholder="Enter grade"
                        onChange={(e) => handleDraftChange(sub.submission_id, "grade", e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1">INSTRUCTOR FEEDBACK</label>
                      <input
                        type="text"
                        value={draft.feedback}
                        placeholder="Add feedback for the student..."
                        onChange={(e) => handleDraftChange(sub.submission_id, "feedback", e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleGradeSubmit(sub.submission_id)}
                      disabled={savingId === sub.submission_id}
                      className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-60"
                    >
                      {savingId === sub.submission_id ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissions;
