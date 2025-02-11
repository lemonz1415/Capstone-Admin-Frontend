"use client";
import { useParams } from "next/navigation";
import QuestionForm from "@/components/question_form";

export default function UpdateQuestion() {
  const params = useParams();
  const questionID = params?.questionID as string;

  return <QuestionForm mode="update" questionID={questionID} />;
}
