import axios from "axios";

const ApiFormData = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

export const createUserApi = (data) => Api.post("/api/users/register", data);
export const loginUserApi = (data) => Api.post("/api/users/login", data);
export const forgotPasswordApi = (email) => Api.post("/api/users/forgot-password", { email });
export const resetPasswordApi = (data) => Api.post("/api/users/reset-password", data);

export const getProfileApi = () => Api.get("/api/users/profile", authConfig());
export const updateProfileApi = (data) => ApiFormData.put("/api/users/profile", data, authConfig());
export const getAllStudentsApi = () => Api.get("/api/users/students", authConfig());
export const deleteStudentApi = (id) => Api.delete(`/api/users/students/${id}`, authConfig());

export const createCourseApi = (data) => ApiFormData.post("/api/courses", data, authConfig());
export const getCoursesApi = () => Api.get("/api/courses", authConfig());
export const deleteCourseApi = (id) => Api.delete(`/api/courses/${id}`, authConfig());
export const updateCourseApi = (id, data) => ApiFormData.put(`/api/courses/${id}`, data, authConfig());

export const createLessonApi = (data) => Api.post("/api/lessons", data, authConfig());
export const getLessonsApi = (courseId) => Api.get(`/api/lessons/course/${courseId}`, authConfig());
export const updateLessonApi = (id, data) => Api.put(`/api/lessons/${id}`, data, authConfig());
export const deleteLessonApi = (id) => Api.delete(`/api/lessons/${id}`, authConfig());

export const getAssignmentsApi = (courseId) => Api.get(`/api/assignments/course/${courseId}`, authConfig());
export const createAssignmentApi = (data) => Api.post("/api/assignments", data, authConfig());
export const updateAssignmentApi = (id, data) => Api.put(`/api/assignments/${id}`, data, authConfig());
export const deleteAssignmentApi = (id) => Api.delete(`/api/assignments/${id}`, authConfig());
export const getSingleAssignmentApi = (id) => Api.get(`/api/assignments/${id}`, authConfig());

export const submitAssignmentApi = (data) => Api.post("/api/submissions", data, authConfig());
export const getSubmissionsByAssignmentApi = (id) => Api.get(`/api/submissions/assignment/${id}`, authConfig());
export const updateGradeApi = (id, data) => Api.put(`/api/submissions/${id}/grade`, data, authConfig());

export const getNotificationsApi = () => Api.get("/api/notifications", authConfig());
export const markNotificationReadApi = (id) => Api.put(`/api/notifications/read/${id}`, {}, authConfig());
export const markAllNotificationsReadApi = () => Api.put("/api/notifications/read-all", {}, authConfig());

export const getMyEnrollmentsApi = () => Api.get("/api/enrollments/my", authConfig());
export const enrollInCourseApi = (courseId) => Api.post("/api/enrollments", { course_id: courseId }, authConfig());
export const unenrollCourseApi = (courseId) => Api.delete(`/api/enrollments/course/${courseId}`, authConfig());

export { Api, ApiFormData };
