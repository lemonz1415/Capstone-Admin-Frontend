"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ManageQuestion() {
  const router = useRouter();

  // Example data for the table with additional columns
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "What is the capital of Japan?",
      skill: "Geography",
      creator: "John Doe",
      createdAt: "2023-01-01",
      status: "Published",
    },
    {
      id: 2,
      title: "Who discovered gravity?",
      skill: "Science",
      creator: "Jane Smith",
      createdAt: "2023-02-15",
      status: "Draft",
    },
    {
      id: 3,
      title: "What is the chemical symbol for water?",
      skill: "Science",
      creator: "Alice Johnson",
      createdAt: "2023-03-01",
      status: "Published",
    },
    {
      id: 4,
      title: "What is the largest planet?",
      skill: "Astronomy",
      creator: "Bob Lee",
      createdAt: "2023-04-10",
      status: "Published",
    },
    {
      id: 5,
      title: "What year did WWII end?",
      skill: "History",
      creator: "Charlie Brown",
      createdAt: "2023-05-22",
      status: "Draft",
    },
    {
      id: 6,
      title: "What is the chemical formula for methane?",
      skill: "Science",
      creator: "David Wilson",
      createdAt: "2023-06-15",
      status: "Published",
    },
    {
      id: 7,
      title: "Who was the first president of the USA?",
      skill: "History",
      creator: "Eva Green",
      createdAt: "2023-07-12",
      status: "Draft",
    },
    {
      id: 8,
      title: "What is the speed of light?",
      skill: "Physics",
      creator: "Frank Adams",
      createdAt: "2023-08-18",
      status: "Published",
    },
    {
      id: 9,
      title: "Who wrote 'Romeo and Juliet'?",
      skill: "Literature",
      creator: "Grace Lee",
      createdAt: "2023-09-05",
      status: "Published",
    },
    {
      id: 10,
      title: "What is the boiling point of water?",
      skill: "Chemistry",
      creator: "Henry Fox",
      createdAt: "2023-10-02",
      status: "Draft",
    },
    // Add more sample data here if needed
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter questions based on search
  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate the filtered questions
  const indexOfLastQuestion = currentPage * itemsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - itemsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  // Calculate the range of page numbers to display
  const pageNumbers = [];
  const startPage = Math.max(1, currentPage - 4); // show 5 pages before current page
  const endPage = Math.min(totalPages, currentPage + 5); // show 5 pages after current page
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex justify-between items-center bg-white shadow-lg rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Manage Questions
          </h1>
        </header>

        {/* Search and Filter Section */}
        <section className="bg-white p-6 mb-8 shadow-lg rounded-lg">
          <div className="flex justify-between items-center">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search for questions..."
              className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Add New Question Button */}
            <button
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition duration-300"
              onClick={() => router.push("/questions/create")}
            >
              Add New Question
            </button>
          </div>
        </section>

        {/* Questions Table */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">
                  No.
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">
                  Sample Question
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">
                  Skill Tested
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">
                  Creator
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">
                  Created Date
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentQuestions.length > 0 ? (
                currentQuestions.map((question, index) => (
                  <tr
                    key={question.id}
                    className="hover:bg-gray-100 transition duration-200"
                  >
                    <td className="py-3 px-4 border-b text-sm text-gray-800">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 border-b text-sm text-gray-800">
                      {question.title}
                    </td>
                    <td className="py-3 px-4 border-b text-sm text-gray-800">
                      {question.skill}
                    </td>
                    <td className="py-3 px-4 border-b text-sm text-gray-800">
                      {question.creator}
                    </td>
                    <td className="py-3 px-4 border-b text-sm text-gray-800">
                      {question.createdAt}
                    </td>
                    <td className="py-3 px-4 border-b text-sm text-gray-800 flex space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 transition duration-300"
                        onClick={() =>
                          alert(`Edit Question: ${question.title}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition duration-300"
                        onClick={() =>
                          alert(`Delete Question: ${question.title}`)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-3 px-4 text-center text-sm text-gray-500"
                  >
                    No questions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="text-sm text-gray-700 flex space-x-1">
            {pageNumbers.map((number) => (
              <button
                key={number}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === number
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } hover:bg-blue-400 transition duration-300`}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            ))}
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
