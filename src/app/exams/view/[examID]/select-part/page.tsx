// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Button from "@/components/button/button";
// import { getExamPreviewQuery } from "@/query/exam.query";
// import NotFound from "@/app/not-found";

// export default function ExamDetail() {
//   const router = useRouter();
//   const params = useParams();
//   const examID = params?.id;

//   const [error, setError] = useState(false);
//   const [data, setData] = useState<{
//     examTitle: string;
//     parts: Array<{
//       sectionName: string;
//       partName: string;
//       questionCount: number;
//       typeID: number;
//     }>;
//   }>({
//     examTitle: "",
//     parts: [],
//   });

//   useEffect(() => {
//     const getExamPreview = async () => {
//       try {
//         const examPreviewData = await getExamPreviewQuery(Number(examID));
//         if (!examPreviewData || examPreviewData.length === 0) {
//           setError(true);
//         } else {
//           setData({
//             examTitle: examPreviewData[0].examTitle || "",
//             parts: examPreviewData,
//           });
//         }
//       } catch {
//         setError(true);
//       }
//     };

//     getExamPreview();
//   }, [examID]);

//   return error ? (
//     <NotFound />
//   ) : (
//     <div className="flex flex-col h-screen p-10">
//       <h1 className="text-2xl font-bold mb-6">
//         Exam Details - {data.examTitle}
//       </h1>
//       <div className="overflow-x-auto">
//         <table className="table-auto w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border border-gray-300 px-4 py-2">Part Name</th>
//               <th className="border border-gray-300 px-4 py-2">Section Name</th>
//               <th className="border border-gray-300 px-4 py-2">
//                 Questions Completed
//               </th>
//               <th className="border border-gray-300 px-4 py-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.parts.map((part, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="border border-gray-300 px-4 py-2">
//                   {part.partName}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2 capitalize">
//                   {part.sectionName}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2 text-center">
//                   {part.questionCount}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2 text-center">
//                   <Button
//                     title="View"
//                     onClick={() =>
//                       router.push(`/exams/${examID}/view?typeID=${part.typeID}`)
//                     }
//                     bgColor="bg-primary-5"
//                     fontSize="body-boldS"
//                     disabled={part.questionCount < 1}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="mt-6 h-[50px] w-[400px] self-center">
//         <Button
//           title="Back to Exam Management"
//           onClick={() => router.push("/exams")}
//           bgColor="bg-primary-5"
//           padding="px-16 py-3"
//           fontSize="body-boldM"
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import SelectPart from "@/components/select_part_page";

export default function ViewSelectPart() {
  return <SelectPart/>;
}

