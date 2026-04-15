/* eslint-disable react-hooks/set-state-in-effect */
// Import React hooks for state management and side effects
import { useEffect, useState } from "react";

// Main App component - Student Management System
export default function App() {
  // STATE DECLARATIONS
  // Stores list of students fetched from database
  const [students, setStudents] = useState([]);

  // Stores form input values (name, email, age)
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    address: "",
    
  });

  // Stores ID of student being edited (null if adding new)
  const [editingId, setEditingId] = useState(null);

  // API endpoint for all student operations
  const API = "http://localhost:5000/students";

  // READ - GET all students from database
  // Router: GET /students
  const fetchStudents = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setStudents(data); // Update state with fetched students
  };

  // Run once when component mounts to load students
  useEffect(() => {
    fetchStudents();
  }, []);

  // HANDLE INPUT CHANGE
  // Updates form state as user types

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value, // Update specific field in form
    });
  };

  // CREATE - POST new student to database
  // Router: POST /students/add
  // Sends form data and refreshes student list
  const addStudent = async () => {
    await fetch(`${API}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form), // Send form data as JSON
    });
    fetchStudents(); // Refresh list after adding
  };

  // UPDATE - PUT existing student in database
  // Router: PUT /students/update/:id
  // Updates student by ID and refreshes list

  const updateStudent = async () => {
    await fetch(`${API}/update/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form), // Send updated form data
    });
    fetchStudents(); // Refresh list after updating
  };

  // DELETE - Remove student from database
  // Router: DELETE /students/delete/:id
  // Deletes student by ID and refreshes list

  const deleteStudent = async (id) => {
    await fetch(`${API}/delete/${id}`, {
      method: "DELETE",
    });
    fetchStudents(); // Refresh list after deleting
  };

  // POPULATE FORM FOR EDITING
  // Fills form with selected student data
  // Sets editingId to indicate edit mode

  const handleEdit = (student) => {
    // Pre-fill form with student's current data
    setForm({
      name: student.name,
      email: student.email,
      age: student.age,
      address: student.address,
      contact: student.contact,
    });
    setEditingId(student._id); // Set edit mode
  };

  // FORM SUBMISSION HANDLER
  // Determines if creating new or updating
  // Calls appropriate function and resets form
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload

    // Check if editing existing student or adding new one
    if (editingId) {
      updateStudent(); // Update existing student
    } else {
      addStudent(); // Add new student
    }

    // Clear form and exit edit mode
    setForm({ name: "", email: "", age: "",address: "", contact: "" });
    setEditingId(null);
  };

  // RENDER - UI COMPONENTS
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <nav className="w-full max-w-4xl flex justify-between items-center py-4">
        <h1>Student Management</h1>
        <div className="space-x-4 flex gap-4 list-none font-bold">
          <li className="decoration-0 ">home</li>
          <li>about</li>
          <li>contact</li>
          <button>logout</button>
        </div>
      </nav>
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Student Management
      </h1>

      {/* FORM CARD - Add or Update Student */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME INPUT */}

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* EMAIL INPUT */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* AGE INPUT */}
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
            {/* ADDRESS INPUT */}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="number"
            name="contact"
            placeholder="Contact"
            value={form.contact}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* SUBMIT BUTTON - Changes text depending on mode */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              editingId
                ? "bg-yellow-500 hover:bg-yellow-600" // Yellow when updating
                : "bg-blue-500 hover:bg-blue-600" // Blue when adding
            }`}
          >
            {editingId ? "Update Student" : "Add Student"}{" "}
            {/* Text changes based on mode */}
          </button>
        </form>
        
        <footer>
          <ul>
            <li>&copy; 2023 Student Management. All rights reserved.</li>
          </ul>
        </footer>
      </div>

      {/* STUDENT LIST SECTION */}
      <div className="w-full max-w-full mt-8">
        {/* LIST HEADING */}
        <h2 className="text-2xl  mb-4 text-gray-700 text-center font-extrabold">
          Students
        </h2>

        {/* EMPTY STATE or STUDENT GRID */}
        {students.length === 0 ? (
          <p className="text-gray-500">No students found</p>
        ) : (
          // GRID LAYOUT - 3 columns
          <ul className="space-y-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* MAP THROUGH STUDENTS ARRAY and render each student */}
            
            {students.map((s) => (
              <li
                key={s._id}
                className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
              >
                {/* STUDENT INFO */}
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-sm text-gray-500">{s.email}</p>
                  <p className="text-sm text-gray-500">Age: {s.age}</p>
                  <p className="text-sm text-gray-500">Address: {s.address}</p>
                  <p className="text-sm text-gray-500">Contact: {s.contact}</p>
                  <p>this my second paragraph </p>
                </div>

                {/* EDIT & DELETE BUTTONS */}
                <div className="space-x-2">
                  {/* EDIT BUTTON - Populates form with student data */}
                  <button
                    onClick={() => handleEdit(s)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>

                  {/* DELETE BUTTON - Removes student from database */}
                  <button
                    onClick={() => deleteStudent(s._id)}
                    className="bg-red-300 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
