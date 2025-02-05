import Button from "./button/button";

interface MenuCardProps {
  title: string;
  desc?: string;
  onClick: () => void;
  disabled?: boolean;
}

export const MenuCard = (props: MenuCardProps) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col justify-center items-center h-[200px]">
      <h4 className="text-xl font-bold mb-4">{props.title}</h4>
      {props.desc && <p className="mb-4">{props.desc}</p>}
      <div className="w-[150px] h-[50px]">
        <Button
          onClick={() => props.onClick()}
          bgColor="bg-primary-5"
          title="Get started !"
          disabled={props.disabled}
        />
      </div>
    </div>
  );
};
