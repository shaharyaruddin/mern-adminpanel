"use client";
import React from "react";
import { ToolTipButton } from "./tool-tip-button";
import { DropdownMenuRadioGroupComponent } from "./dropdown-menu-ratio-group";
import { ArrowUp, CircleStop, Paperclip, Square } from "lucide-react";
import { Textarea } from "./ui/textarea";

const ChatBox = ({
  chating = { chat: "", setChat: () => {} },
  fileButtonOnClick = () => {},
  sendMessageOnClick = () => {},
  subjectSelection = { selectedSubject: "mathematics", setSelectedSubject: () => {} },
}) => {
  const { chat, setChat } = chating;
  const { selectedSubject, setSelectedSubject } = subjectSelection;
  return (
    <div className="w-full min-h-20 absolute bottom-10 left-0 flex justify-center items-center">
      <div className="max-w-[80%] min-h-24 bg-sidebar bg-sidebar-boder border w-full rounded-3xl p-3">
        {/* text area */}
        <Textarea
          value={chat} 
          onChange={(e) => setChat(e.target.value)}
          placeholder="How can Help?"
          className="outline-none! border-none! ring-0! bg-sidebar! resize-none min-h-12 shadow-none! max-h-52! custom-scroll"
        />
        {/* button section */}
        <div className="w-full flex items-center justify-between">
          <div className="flex space-x-2 items-center">
            <ToolTipButton
              children={<Paperclip />}
              onClick={fileButtonOnClick}
              tooltip="attach the file"
              className="size-8 rounded-full"
              size="sm"
              variant="outline"
            />
            <DropdownMenuRadioGroupComponent
              value={selectedSubject}
              onValueChange={setSelectedSubject}
            />
          </div>
          {/* send message button */}
          <ToolTipButton
            children={<ArrowUp strokeWidth={3}/>}
            disabled={chat.trim() === "" ? true : false}
            onClick={sendMessageOnClick}
            className="rounded-full size-10"
            tooltip="Send message"
          />
          {/* stop generation */}
          <ToolTipButton
            children={<Square strokeWidth={3}/>}
            onClick={sendMessageOnClick}
            className="rounded-full size-10"
            tooltip="Stop"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;