import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createAssignmentApi,
  createLessonApi,
  deleteAssignmentApi,
  deleteLessonApi,
  getAssignmentsApi,
  getCoursesApi,
  getLessonsApi,
  submitAssignmentApi,
  updateLessonApi,
} from "../services/api";

const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return "student";

  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    return payload?.role || "student";
  } catch (_err) {
    const user = localStorage.getItem("user");
    if (!user) return "student";
    try {
      return JSON.parse(user)?.role || "student";
    } catch (_e) {
      return "student";
    }
  }
};

const CourseDetails = () => {
  const { id: courseId } = useParams();
  const role = useMemo(() => getUserRole(), []);
  const canManageCourse = role === "instructor" || role === "admin";
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonForm, setLessonForm] = useState({ title: "", content: "" });
  const [editingLessonId, setEditingLessonId] = useState(null);

  const [assignments, setAssignments] = useState([]);
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [submissionData, setSubmissionData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCourse = async () => {
    try {
      const { data } = await getCoursesApi();
      if (data?.success) {
        const found = (data.courses || []).find((c) => c.course_id === Number(courseId));
        setCourse(found || null);
      }
    } catch (err) {
      console.error("FETCH COURSE ERROR:", err);
      toast.error("Failed to load course");
    }
  };

  const fetchLessons = async () => {
    try {
      const { data } = await getLessonsApi(courseId);
      if (data?.success) {
        setLessons(data.lessons || []);
      } else {
        toast.error(data?.message || "Failed to load lessons");
      }
    } catch (err) {
      console.error("FETCH LESSONS ERROR:", err);
      toast.error("Failed to load lessons");
    }
  };

  const fetchAssignments = async () => {
    try {
      const { data } = await getAssignmentsApi(courseId);
      if (data?.success) {
        setAssignments(data.assignments || []);
      } else {
        toast.error(data?.message || "Failed to load assignments");
      }
    } catch (err) {
      console.error("FETCH ASSIGNMENTS ERROR:", err);
      toast.error("Failed to load assignments");
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchCourse();
      await fetchLessons();
      await fetchAssignments();
      setLoading(false);
    };

    init();
  }, [courseId]);

  const handleLessonSubmit = async (e) => {
    e.preventDefault();

    if (!lessonForm.title || !lessonForm.content) {
      toast.error("All fields are required");
      return;
    }

    try {
      if (editingLessonId) {
        const { data } = await updateLessonApi(editingLessonId, lessonForm);
        if (data?.success) {
          toast.success("Lesson updated!");
          setEditingLessonId(null);
          setLessonForm({ title: "", content: "" });
          fetchLessons();
        } else {
          toast.error(data?.message || "Failed to update lesson");
        }
      } else {
        const { data } = await createLessonApi({ ...lessonForm, courseId: Number(courseId) });
        if (data?.success) {
          toast.success("Lesson added!");
          setLessonForm({ title: "", content: "" });
          fetchLessons();
        } else {
          toast.error(data?.message || "Failed to add lesson");
        }
      }
    } catch (err) {
      console.error("LESSON ERROR:", err);
      toast.error("Operation failed");
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      const { data } = await deleteLessonApi(lessonId);
      if (data?.success) {
        toast.success("Lesson deleted!");
        fetchLessons();
      }
    } catch (err) {
      console.error("DELETE LESSON ERROR:", err);
      toast.error("Failed to delete lesson");
    }
  };

  const handleEditLesson = (lesson) => {
    setEditingLessonId(lesson.lesson_id);
    setLessonForm({ title: lesson.title, content: lesson.content });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();

    if (!assignmentForm.title || !assignmentForm.dueDate) {
      toast.error("Title and Due Date are required");
      return;
    }

    try {
      const { data } = await createAssignmentApi({
        ...assignmentForm,
        courseId: Number(courseId),
      });
      if (data?.success) {
        toast.success("Assignment posted!");
        setAssignmentForm({ title: "", description: "", dueDate: "" });
        fetchAssignments();
      }
    } catch (_err) {
      toast.error("Failed to add assignment");
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;

    try {
      const { data } = await deleteAssignmentApi(id);
      if (data?.success) {
        toast.success("Assignment removed");
        fetchAssignments();
      }
    } catch (_err) {
      toast.error("Delete failed");
    }
  };

  const handleStudentSubmit = async (assignmentId) => {
    const text = submissionData[assignmentId];
    if (!text || text.trim() === "") {
      toast.error("Submission cannot be empty");
      return;
    }

    try {
      const { data } = await submitAssignmentApi({
        assignment_id: assignmentId,
        submission_text: text,
      });
      if (data?.success) {
        toast.success("Work submitted successfully!");
        setSubmissionData((prev) => ({ ...prev, [assignmentId]: "" }));
      } else {
        toast.error(data?.message || "Submission failed");
      }
    } catch (_err) {
      toast.error("Error submitting work");
    }
  };

  if (loading) {
    return <p className="text-center text-slate-500 mt-12 font-medium">Loading course details...</p>;
  }

  if (!course) {
    return <p className="text-center text-slate-500 mt-12 font-medium">Course not found.</p>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => navigate("/courses")}
            className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm mb-4 flex items-center gap-1 transition-colors"
          >
            {'<-'} Back to Courses
          </button>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">{course.title}</h2>
          <p className="text-slate-600 leading-relaxed">{course.description}</p>
          <p className="text-xs text-slate-400 mt-2 capitalize">Role: {role}</p>
        </div>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900">Assignments</h3>

          {canManageCourse && (
            <form onSubmit={handleAssignmentSubmit} className="bg-white p-6 rounded-2xl shadow-sm space-y-4 border border-slate-200">
              <h4 className="font-bold text-lg">Create New Assignment</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Assignment Title"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="p-3 bg-white rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  value={assignmentForm.dueDate}
                  onChange={(e) => setAssignmentForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="p-3 bg-white rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <textarea
                placeholder="Assignment Description"
                value={assignmentForm.description}
                onChange={(e) => setAssignmentForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 bg-white rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-800 transition-all">
                Post Assignment
              </button>
            </form>
          )}

          <div className="grid gap-4">
            {assignments.length === 0 ? (
              <p className="text-slate-400 italic">No assignments posted.</p>
            ) : (
              assignments.map((asgn) => (
                <div key={asgn.assignment_id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{asgn.title}</h4>
                      <p className="text-sm text-indigo-600 font-medium">
                        Due: {asgn.due_date ? new Date(asgn.due_date).toLocaleDateString() : "Not set"}
                      </p>
                      <p className="text-slate-600 mt-2">{asgn.description}</p>
                    </div>
                    {canManageCourse && (
                      <button
                        onClick={() => handleDeleteAssignment(asgn.assignment_id)}
                        className="text-red-500 hover:text-red-700 text-sm font-bold"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {role === "student" && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <textarea
                        placeholder="Type your submission or paste a link here..."
                        value={submissionData[asgn.assignment_id] || ""}
                        onChange={(e) =>
                          setSubmissionData((prev) => ({ ...prev, [asgn.assignment_id]: e.target.value }))
                        }
                        className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleStudentSubmit(asgn.assignment_id)}
                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-all"
                      >
                        Submit Work
                      </button>
                    </div>
                  )}

                  {canManageCourse && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => navigate(`/assignment-submissions/${asgn.assignment_id}`)}
                        className="text-indigo-600 text-sm font-bold hover:text-indigo-800 transition-colors"
                      >
                        View and Grade Submissions 
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-6 pt-6 border-t">
          <h3 className="text-2xl font-bold text-slate-900">Curriculum</h3>

          {canManageCourse && (
            <form onSubmit={handleLessonSubmit} className="bg-white p-8 rounded-2xl shadow-sm space-y-4 border border-slate-200">
              <h3 className="font-bold text-xl">{editingLessonId ? "Edit Lesson" : "Add New Lesson"}</h3>
              <input
                type="text"
                placeholder="Lesson Title"
                value={lessonForm.title}
                onChange={(e) => setLessonForm((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Lesson Content"
                rows="4"
                value={lessonForm.content}
                onChange={(e) => setLessonForm((prev) => ({ ...prev, content: e.target.value }))}
                className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                    editingLessonId ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-indigo-500 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {editingLessonId ? "Update Lesson" : "Add Lesson"}
                </button>
                {editingLessonId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLessonId(null);
                      setLessonForm({ title: "", content: "" });
                    }}
                    className="px-6 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            {lessons.length === 0 ? (
              <p className="text-slate-400 italic py-4">No lessons added yet.</p>
            ) : (
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div key={lesson.lesson_id} className="p-5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                            LESSON {index + 1}
                          </span>
                          <h4 className="font-bold text-slate-800 text-lg">{lesson.title}</h4>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{lesson.content}</p>
                      </div>
                      {canManageCourse && (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleEditLesson(lesson)}
                            className="px-3 py-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.lesson_id)}
                            className="px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CourseDetails;
