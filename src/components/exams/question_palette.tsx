import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const QuestionPalette = () => {
  return (
    <div className="bg-white rounded-xl shadow-soft p-6 w-1/3 h-fit">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold">Question Palette</span>
        <div className="flex space-x-2">
          <FontAwesomeIcon
            icon={faCircleChevronLeft}
            className="text-gray-400 text-xl hover:text-blue-500 cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faCircleChevronRight}
            className="text-gray-400 text-xl hover:text-blue-500 cursor-pointer"
          />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 20 }, (_, i) => (
          <button
            key={i}
            className={`w-10 h-10 rounded-lg mx-[20px] ${
              i === 0
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            } transition-all`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
