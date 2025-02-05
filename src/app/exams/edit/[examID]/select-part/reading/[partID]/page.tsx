"use client";

import { useEffect, useState } from "react";
import QuestionForm from "@/components/question_form";
import PageHeading from "@/components/page_heading";
import { useParams, useRouter } from "next/navigation";
import { getExamPreviewQuery } from "@/query/exam.query";
import { toast } from "react-toastify";

export default function ReadingPartEdit() {
  const params = useParams();
  const router = useRouter();
  const { partID, examID } = params;

  const [examParts, setExamParts] = useState<any[]>([]);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const data = await getExamPreviewQuery(Number(examID));
        if (data && data.length > 0) {
          const groupedData = data.reduce((acc: any, item: any) => {
            const sectionIndex = acc.findIndex(
              (section: any) => section.section === item.sectionName
            );
            if (sectionIndex === -1) {
              acc.push({
                section: item.sectionName,
                parts: [
                  {
                    id: item.typeID,
                    partName: item.partName,
                    noOfQuestion: item.questionCount,
                  },
                ],
              });
            } else {
              acc[sectionIndex].parts.push({
                id: item.typeID,
                partName: item.partName,
                noOfQuestion: item.questionCount,
              });
            }
            return acc;
          }, []);

          setExamParts(groupedData);
        } else {
          toast.error("Exam not found.");
          router.push("/exams");
        }
      } catch (error) {
        console.error("Error fetching exam data:", error);
        toast.error("Error loading exam data.");
        router.push("/exams");
      }
    };

    if (examID) {
      fetchExamData();
    }
  }, [examID, router]);

  const currentPart = examParts
    .flatMap((section) =>
      section.parts.map((part: any) => ({ ...part, section: section.section }))
    )
    .find((part) => part.id === Number(partID));

  // if (!currentPart) {
  //   return <p className="p-6">Part not found.</p>;
  // }

  return (
    Boolean(currentPart) && (
      <div className="p-6">
        <PageHeading
          title={`Edit Questions for [ ${currentPart.section} - ${currentPart.partName} ]`}
          subtitle={`Modify questions in TOEIC ${currentPart.partName}.`}
          showBackButton={true}
        />
        <QuestionForm
          examID={Number(examID)}
          partID={Number(partID)}
          mode="edit"
        />
      </div>
    )
  );
}
