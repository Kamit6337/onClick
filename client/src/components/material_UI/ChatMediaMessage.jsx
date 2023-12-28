import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";

import { Icons } from "../../assets/icons";
import { useState } from "react";

const actions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
];

export default function ChatMediaMessage() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [index, setIndex] = useState(null);

  return (
    <section className="relative" onMouseLeave={() => setToggleMenu(false)}>
      <div
        className="rounded-full p-2 bg-color_3 text-color_1 hover:bg-color_3/90"
        onMouseEnter={() => setToggleMenu(true)}
        onClick={() =>
          toggleMenu ? setToggleMenu(false) : setToggleMenu(true)
        }
      >
        <Icons.plus
          className={`${
            toggleMenu && "rotate-45"
          } transition-all duration-300 text-xl`}
        />
      </div>
      {toggleMenu && (
        <div className="absolute bottom-full flex flex-col  gap-6 pb-8">
          {actions.map((action, i) => {
            const { icon, name } = action;

            return (
              <div key={i} className="relative cursor-pointer  text-center">
                <p
                  onMouseEnter={() => setIndex(i)}
                  onMouseLeave={() => setIndex(null)}
                  className="p-1 bg-color_3 box_shadow rounded-full text-color_1 text-sm"
                >
                  {icon}
                </p>

                {index === i && (
                  <div className="absolute top-0 z-10 right-full mr-2 bg-color_4/50 text-color_1 px-1 py-[1px] rounded-md  ">
                    {name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
