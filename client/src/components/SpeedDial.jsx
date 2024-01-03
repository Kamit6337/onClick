/* eslint-disable react/prop-types */
import { useState } from "react";
import { Icons } from "../assets/icons";

const RIGHT = "right";
const LEFT = "left";
const NORMAL = "normal";
const BIGGER = "bigger";

const SpeedDial = ({
  actions,
  handleOptionClick,
  position = LEFT,
  size = NORMAL,
}) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [index, setIndex] = useState(null);
  return (
    <section
      className="relative flex flex-col items-center"
      onMouseLeave={() => setToggleMenu(false)}
    >
      <div
        className={`
        ${size === NORMAL && "p-2"}
        ${size === BIGGER && "p-3"}
        rounded-full  bg-color_3 text-color_1 hover:bg-color_3/90
        `}
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
        <div className="absolute z-10 bottom-full flex flex-col  gap-6 pb-8">
          {actions.map((action, i) => {
            const { id, icon, name } = action;

            return (
              <div key={i} className="relative cursor-pointer  text-center ">
                <p
                  onMouseEnter={() => setIndex(i)}
                  onMouseLeave={() => setIndex(null)}
                  className="p-1 bg-color_3 box_shadow rounded-full text-color_1 text-sm"
                  onClick={() => handleOptionClick(id)}
                >
                  {icon}
                </p>

                {index === i && (
                  <div
                    className={`
                  ${position === LEFT && "right-full mr-2"}  
                  ${position === RIGHT && "left-full ml-2"}  
                  
                   absolute top-0 z-10 h-full whitespace-nowrap   flex items-center`}
                  >
                    <p className="bg-color_4/50 text-color_1 px-1 py-[1px] rounded-md">
                      {name}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default SpeedDial;
