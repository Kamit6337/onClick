/* eslint-disable react/prop-types */

import { useDispatch } from "react-redux";
import OnClickOutside from "../../../../../lib/onClickOutside";
import { toggleChatOptionOnRightClick } from "../../../../../redux/slice/toggleSlice";
import { deleteChatReducer } from "../../../../../redux/slice/mutationSlice";

const RightClickMenu = ({ data }) => {
  const dispatch = useDispatch();

  const closeOptions = () => {
    dispatch(
      toggleChatOptionOnRightClick({
        bool: false,
        data: null,
      })
    );
  };

  const { ref } = OnClickOutside(closeOptions);

  const deleteChat = () => {
    closeOptions();
    dispatch(deleteChatReducer({ bool: true, data: data?.chatId }));
  };

  const y = data?.y;
  const x = data?.x;

  const windowWidth = window.innerWidth;
  return (
    <>
      <div className="absolute z-10 top-0 w-full h-full">
        <div
          ref={ref}
          className="absolute w-44 z-50 border border-color_4 bg-color_2 rounded-xl"
          style={{
            top: y,
            left: x > windowWidth / 2 ? x - 176 : x,
          }}
        >
          <div
            onClick={() => alert("Option 2")}
            className="border-b border-color_4 rounded-t-xl p-2 flex justify-center items-center cursor-pointer hover:bg-color_1"
          >
            Option 1
          </div>
          <div
            onClick={deleteChat}
            className=" p-2 flex justify-center rounded-b-xl items-center cursor-pointer hover:bg-color_1"
          >
            Delete
          </div>
        </div>
      </div>
    </>
  );
};

export default RightClickMenu;
